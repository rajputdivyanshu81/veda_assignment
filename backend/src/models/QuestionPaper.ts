import { Schema, model, Document, Types } from 'mongoose';

export interface IQuestion {
  text: string;
  type: string; // 'MCQ' | 'Short' | 'Long'
  options?: string[]; // MCQs choices
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction?: string;
  questions: IQuestion[];
}

export interface IQuestionPaper extends Document {
  assignmentId: Types.ObjectId;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  type: { type: String, required: true },
  options: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String },
  questions: [QuestionSchema]
});

const QuestionPaperSchema = new Schema<IQuestionPaper>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  sections: [SectionSchema]
}, { timestamps: true });

export const QuestionPaper = model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);
