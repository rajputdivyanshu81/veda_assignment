import { create } from 'zustand';

export interface Question {
  _id?: string;
  text: string;
  type: string;
  options?: string[];
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface Section {
  _id?: string;
  title: string;
  instruction?: string;
  questions: Question[];
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  fileName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultId?: string;
}

export interface QuestionPaper {
  _id: string;
  assignmentId: string;
  sections: Section[];
}

interface AssignmentState {
  // Creating assessment form
  isGenerating: boolean;
  generationProgress: number;
  generationMessage: string;
  activeAssignmentId: string | null;
  error: string | null;

  // View state
  currentAssignment: Assignment | null;
  currentPaper: QuestionPaper | null;
  isLoadingResult: boolean;

  // Actions
  setGenerating: (generating: boolean, progress?: number, message?: string) => void;
  setGenerationProgress: (progress: number, message: string) => void;
  setActiveAssignmentId: (id: string | null) => void;
  setError: (error: string | null) => void;
  
  fetchAssignmentResult: (id: string) => Promise<void>;
  createAssignment: (payload: {
    title: string;
    dueDate: string;
    questionTypes: string[];
    questionRows: { type: string; count: number; marks: number }[];
    totalQuestions: number;
    totalMarks: number;
    instructions?: string;
    fileName?: string;
    fileContent?: string;
  }) => Promise<string>;
  regenerateAssignment: (id: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  isGenerating: false,
  generationProgress: 0,
  generationMessage: '',
  activeAssignmentId: null,
  error: null,
  currentAssignment: null,
  currentPaper: null,
  isLoadingResult: false,

  setGenerating: (generating, progress = 0, message = '') => 
    set({ isGenerating: generating, generationProgress: progress, generationMessage: message, error: null }),
  
  setGenerationProgress: (progress, message) => 
    set({ generationProgress: progress, generationMessage: message }),

  setActiveAssignmentId: (id) => set({ activeAssignmentId: id }),
  setError: (error) => set({ error }),

  createAssignment: async (payload) => {
    set({ isGenerating: true, generationProgress: 5, generationMessage: 'Submitting parameters to server...', error: null });
    try {
      const response = await fetch(`${API_URL}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create assignment');
      }
      const data: Assignment = await response.json();
      set({ activeAssignmentId: data._id });
      return data._id;
    } catch (err: any) {
      set({ isGenerating: false, error: err.message });
      throw err;
    }
  },

  fetchAssignmentResult: async (id) => {
    set({ isLoadingResult: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/assignments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignment details');
      }
      const data = await response.json();
      set({
        currentAssignment: data.assignment,
        currentPaper: data.paper,
        isLoadingResult: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoadingResult: false });
    }
  },

  regenerateAssignment: async (id) => {
    set({ isGenerating: true, generationProgress: 5, generationMessage: 'Queuing regeneration task...', error: null, activeAssignmentId: id });
    try {
      const response = await fetch(`${API_URL}/api/assignments/${id}/regenerate`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to trigger regeneration');
      }
    } catch (err: any) {
      set({ isGenerating: false, error: err.message });
    }
  }
}));
