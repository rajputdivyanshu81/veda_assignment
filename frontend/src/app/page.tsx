'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../store/assignmentStore';
import { useSocket } from '../hooks/useSocket';
import { Upload, Calendar, Layers, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function CreateAssignment() {
  const router = useRouter();
  
  // Zustand States
  const createAssignment = useAssignmentStore((state) => state.createAssignment);
  const isGenerating = useAssignmentStore((state) => state.isGenerating);
  const generationProgress = useAssignmentStore((state) => state.generationProgress);
  const generationMessage = useAssignmentStore((state) => state.generationMessage);
  const activeAssignmentId = useAssignmentStore((state) => state.activeAssignmentId);
  const error = useAssignmentStore((state) => state.error);
  const setGenerating = useAssignmentStore((state) => state.setGenerating);

  // Form states
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questionTypes, setQuestionTypes] = useState<string[]>(['MCQ']);
  const [totalQuestions, setTotalQuestions] = useState<number | ''>(5);
  const [totalMarks, setTotalMarks] = useState<number | ''>(50);
  const [instructions, setInstructions] = useState('');
  
  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Connect WebSockets when generation starts and listen for progress
  useSocket(activeAssignmentId, (resultId) => {
    // When socket reports completed, navigate to the result page
    router.push(`/assignment/${activeAssignmentId}`);
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text || '');
    };
    reader.readAsText(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleQuestionType = (type: string) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter((t) => t !== type));
      }
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Front-end validations
    if (!title.trim()) {
      setValidationError('Please enter an assignment title');
      return;
    }
    if (!dueDate) {
      setValidationError('Please select a due date');
      return;
    }
    if (questionTypes.length === 0) {
      setValidationError('Please select at least one question type');
      return;
    }
    if (!totalQuestions || totalQuestions <= 0) {
      setValidationError('Total questions count must be greater than zero');
      return;
    }
    if (!totalMarks || totalMarks <= 0) {
      setValidationError('Total marks must be greater than zero');
      return;
    }

    try {
      await createAssignment({
        title,
        dueDate,
        questionTypes,
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        instructions,
        fileName: file?.name,
        fileContent: fileContent
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-400 text-xs font-semibold mb-4 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            AI Assessment Creator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-violet-100 to-indigo-200 tracking-tight">
            Create an Assignment
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Configure assignment details, upload optional text reference files, and generate an exam question paper using Groq AI.
          </p>
        </header>

        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title & Instructions Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics Final Term Paper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Due Date & Time
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100 scheme-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Additional Instructions (AI Prompts)
                </label>
                <textarea
                  placeholder="e.g. Focus questions on Newtonian Physics. Include real-world problem scenarios. Keep tone academic."
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100 resize-none"
                />
              </div>
            </div>

            {/* Constraints & File Upload Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Question Types
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['MCQ', 'Short', 'Long'].map((type) => {
                    const isSelected = questionTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => toggleQuestionType(type)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'bg-slate-950/80 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {type === 'MCQ' ? 'MCQs' : type === 'Short' ? 'Short Answer' : 'Long Answer'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Reference File Upload (Optional .txt/.md)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    dragging
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : file
                      ? 'border-emerald-600 bg-emerald-950/5'
                      : 'border-slate-800 bg-slate-950/30 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.md,.json"
                    className="hidden"
                  />
                  {file ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-700 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-emerald-400 truncate max-w-xs mx-auto">
                        {file.name}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold mt-1"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        Drag and drop text reference file here
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Accepts .txt, .md or .json files up to 2MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:translate-y-0.5 tracking-wider uppercase"
            >
              Generate Question Paper
            </button>
          </div>
        </form>
      </div>

      {/* Generation Real-time Queue Progress Modal / Drawer */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Generating Question Paper
            </h3>
            <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
              Please wait. Groq LLM is crafting exam questions and structuring them into sections.
            </p>

            <div className="mb-4">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Status: {generationMessage}</span>
                <span>{generationProgress}%</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Error: {error}</span>
                <button
                  onClick={() => setGenerating(false)}
                  className="underline hover:text-red-200 ml-1 font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
