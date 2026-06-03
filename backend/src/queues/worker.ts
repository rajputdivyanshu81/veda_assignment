import { Worker, Job } from 'bullmq';
import { redisConnection } from './queue';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { generateQuestionPaper } from '../services/aiService';
import { getIO } from '../index';

interface JobData {
  assignmentId: string;
}

export const startWorker = () => {
  const worker = new Worker<JobData>(
    'assessment-queue',
    async (job: Job<JobData>) => {
      const { assignmentId } = job.data;
      console.log(`[Worker] Started processing assignment: ${assignmentId}`);

      const io = getIO();
      const emitProgress = (progress: number, message: string) => {
        job.updateProgress(progress);
        if (io) {
          io.to(assignmentId).emit('generation:progress', { progress, message });
        }
      };

      try {
        emitProgress(10, 'Initializing generation task...');

        // 1. Fetch assignment from DB
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
          throw new Error('Assignment not found');
        }

        assignment.status = 'processing';
        await assignment.save();
        emitProgress(20, 'Analyzing instructions and parameters...');

        // 2. Fetch or parse references (simulate parsing file if URL exists)
        let referenceText = '';
        if (assignment.fileUrl) {
          emitProgress(30, 'Reading uploaded reference material...');
          referenceText = `This assignment references an uploaded document: ${assignment.fileName}. Focus questions on key academic concepts in the context of: ${assignment.instructions || 'the document content'}`;
        }

        emitProgress(40, 'Generating structured questions with Groq AI...');

        // 3. Generate questions using Groq
        const sections = await generateQuestionPaper({
          title: assignment.title,
          questionTypes: assignment.questionTypes,
          questionRows: assignment.questionRows || [],
          totalQuestions: assignment.totalQuestions,
          totalMarks: assignment.totalMarks,
          instructions: assignment.instructions,
          fileText: referenceText
        });

        emitProgress(85, 'AI successfully generated questions. Structuring paper...');

        // 4. Create and save QuestionPaper result
        const questionPaper = new QuestionPaper({
          assignmentId: assignment._id,
          sections
        });
        await questionPaper.save();

        // 5. Update assignment links and status
        assignment.resultId = questionPaper._id as any;
        assignment.status = 'completed';
        await assignment.save();

        emitProgress(100, 'Question paper successfully created and saved!');
        
        if (io) {
          io.to(assignmentId).emit('generation:completed', {
            assignmentId,
            resultId: questionPaper._id
          });
        }

        console.log(`[Worker] Completed assignment: ${assignmentId}`);
        return { success: true, resultId: questionPaper._id };
      } catch (error: any) {
        console.error(`[Worker] Error in job execution: ${error.message}`);
        
        // Update status to failed
        try {
          await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
        } catch (dbErr) {
          console.error('[Worker] Failed to update fail status in DB', dbErr);
        }

        if (io) {
          io.to(assignmentId).emit('generation:failed', {
            error: error.message || 'Generation failed'
          });
        }

        throw error;
      }
    },
    {
      connection: redisConnection as any,
      concurrency: 2, // Allow 2 generation tasks concurrently
    }
  );

  worker.on('active', (job) => {
    console.log(`[Worker] Job ${job.id} active`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  return worker;
};
