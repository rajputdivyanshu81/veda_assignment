import { Schema, model, Document, Types } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  fileUrl?: string;
  fileName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: [{ type: String, required: true }],
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  resultId: { type: Schema.Types.ObjectId, ref: 'QuestionPaper' }
}, { timestamps: true });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);
