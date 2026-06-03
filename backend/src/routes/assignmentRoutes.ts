import { Router, Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { assessmentQueue } from '../queues/queue';
import PDFDocument from 'pdfkit';

const router = Router();

// List all assignments
router.get('/assignments', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error: any) {
    console.error('[Routes] Error listing assignments:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Delete an assignment
router.delete('/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    // Also delete the associated question paper
    if (assignment.resultId) {
      await QuestionPaper.findByIdAndDelete(assignment.resultId);
    }
    await Assignment.findByIdAndDelete(id);
    res.json({ message: 'Assignment deleted' });
  } catch (error: any) {
    console.error('[Routes] Error deleting assignment:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Create new assignment & enqueue generation job
router.post('/assignments', async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, questionRows, totalQuestions, totalMarks, instructions, fileName, fileContent } = req.body;

    // Simple validation
    if (!title || !dueDate || !totalQuestions || !totalMarks) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (totalQuestions <= 0 || totalMarks <= 0) {
      return res.status(400).json({ error: 'Questions and Marks must be greater than zero' });
    }

    // Derive questionTypes from questionRows if not provided
    const derivedTypes = questionTypes || (questionRows ? questionRows.map((r: any) => r.type) : []);

    // Create assignment entry
    const assignment = new Assignment({
      title,
      dueDate: new Date(dueDate),
      questionTypes: derivedTypes,
      questionRows: questionRows || [],
      totalQuestions,
      totalMarks,
      instructions,
      fileName,
      fileUrl: fileContent ? 'stored-locally' : undefined,
      status: 'pending'
    });

    await assignment.save();

    // Enqueue BullMQ job
    await assessmentQueue.add(`generate-${assignment._id}`, {
      assignmentId: assignment._id.toString()
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    console.error('[Routes] Error creating assignment:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Get assignment metadata and its question paper
router.get('/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    let paper = null;
    if (assignment.resultId) {
      paper = await QuestionPaper.findById(assignment.resultId);
    }

    res.json({ assignment, paper });
  } catch (error: any) {
    console.error('[Routes] Error fetching assignment:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Trigger regeneration of an assignment
router.post('/assignments/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Reset status and queue new job
    assignment.status = 'pending';
    assignment.resultId = undefined;
    await assignment.save();

    await assessmentQueue.add(`generate-${assignment._id}`, {
      assignmentId: assignment._id.toString()
    });

    res.json({ message: 'Regeneration job queued', assignment });
  } catch (error: any) {
    console.error('[Routes] Error regenerating assignment:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Download Question Paper as a print-ready formatted PDF
router.get('/assignments/:id/pdf', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (!assignment.resultId) {
      return res.status(400).json({ error: 'Question paper has not been generated yet' });
    }

    const paper = await QuestionPaper.findById(assignment.resultId);
    if (!paper) {
      return res.status(404).json({ error: 'Generated question paper not found' });
    }

    // Initialize PDF Document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set Response Headers to download PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=assessment-${id}.pdf`);
    doc.pipe(res);

    // --- PDF Formatting Layout ---
    
    // Header Title
    doc.font('Helvetica-Bold').fontSize(18).text(assignment.title.toUpperCase(), { align: 'center' });
    doc.moveDown(0.5);

    // Instructions or description
    if (assignment.instructions) {
      doc.font('Helvetica-Oblique').fontSize(10).text(`Instructions: ${assignment.instructions}`, { align: 'center' });
      doc.moveDown(1);
    }

    // Marks and Questions Summary Info Header
    const totalQText = `Total Questions: ${assignment.totalQuestions}`;
    const totalMText = `Max Marks: ${assignment.totalMarks}`;
    
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text(totalQText, 50, doc.y, { width: 250, align: 'left' });
    doc.text(totalMText, 300, doc.y, { width: doc.page.width - 350, align: 'right' });
    doc.moveDown(0.5);
    
    // Divider line
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#888888').lineWidth(1).stroke();
    doc.moveDown(1);

    // Student Info Block
    doc.font('Helvetica').fontSize(10);
    doc.text('Student Name: _______________________', 50, doc.y, { lineBreak: false });
    doc.text('Roll No: __________________', 320, doc.y);
    doc.moveDown(0.5);
    doc.text('Section: ____________________________', 50, doc.y, { lineBreak: false });
    doc.text('Date: ____________________', 320, doc.y);
    doc.moveDown(1);

    // Double divider
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#444444').lineWidth(1.5).stroke();
    doc.moveDown(1.5);

    // Iterate through sections
    let qCounter = 1;
    paper.sections.forEach((section, sIndex) => {
      // Check space remaining, add page if tight
      if (doc.y > doc.page.height - 120) {
        doc.addPage();
      }

      doc.font('Helvetica-Bold').fontSize(12).text(section.title, { underline: true });
      if (section.instruction) {
        doc.font('Helvetica-Oblique').fontSize(9).fillColor('#444444').text(section.instruction);
        doc.fillColor('#000000'); // reset color
      }
      doc.moveDown(0.5);

      section.questions.forEach((q, qIndex) => {
        if (doc.y > doc.page.height - 100) {
          doc.addPage();
        }

        const initialY = doc.y;
        
        // Question number and difficulty badge
        const diffText = `[${q.difficulty}]`;
        doc.font('Helvetica-Bold').fontSize(10).text(`${qCounter}. `, 50, initialY, { width: 20, lineBreak: false });
        
        // Question Text
        doc.font('Helvetica').fontSize(10).text(q.text, 70, initialY, { width: doc.page.width - 160 });
        
        // Question Marks
        const marksText = `(${q.marks} Marks)`;
        doc.font('Helvetica-Bold').fontSize(10).text(marksText, doc.page.width - 100, initialY, { width: 50, align: 'right' });
        
        // Add options if MCQ
        if (q.type === 'MCQ' && q.options && q.options.length > 0) {
          doc.moveDown(0.3);
          const optionLetters = ['a', 'b', 'c', 'd', 'e'];
          q.options.forEach((opt, oIdx) => {
            const letter = optionLetters[oIdx] || '*';
            doc.font('Helvetica').fontSize(9).text(`(${letter}) ${opt}`, 85, doc.y);
          });
        }
        
        doc.moveDown(0.8);
        qCounter++;
      });

      doc.moveDown(1);
    });

    // Finalize PDF
    doc.end();
  } catch (error: any) {
    console.error('[Routes] Error exporting PDF:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

export const assignmentRoutes = router;
