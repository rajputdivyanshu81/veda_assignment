'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';
import {
  CloudUpload,
  Calendar,
  Plus,
  Minus,
  X,
  ArrowLeft,
  ArrowRight,
  Mic,
  ChevronDown,
} from 'lucide-react';

interface QuestionRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions',
  'True/False',
  'Fill in the Blanks',
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const createAssignment = useAssignmentStore((s) => s.createAssignment);

  // Form state
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  // File upload
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Due date
  const [dueDate, setDueDate] = useState('');

  // Question types
  const [questionRows, setQuestionRows] = useState<QuestionRow[]>([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', count: 5, marks: 5 },
  ]);

  // Additional info
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // ── File Handlers ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };
  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) return; // 10MB limit
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent((event.target?.result as string) || '');
    };
    reader.readAsText(selectedFile);
  };

  // ── Question Row Handlers ──
  const addQuestionRow = () => {
    const usedTypes = questionRows.map((r) => r.type);
    const nextType =
      QUESTION_TYPE_OPTIONS.find((t) => !usedTypes.includes(t)) ||
      QUESTION_TYPE_OPTIONS[0];
    setQuestionRows([
      ...questionRows,
      { id: Date.now().toString(), type: nextType, count: 5, marks: 10 },
    ]);
  };

  const removeQuestionRow = (id: string) => {
    if (questionRows.length > 1) {
      setQuestionRows(questionRows.filter((r) => r.id !== id));
    }
  };

  const updateRow = (
    id: string,
    field: 'type' | 'count' | 'marks',
    value: string | number
  ) => {
    setQuestionRows(
      questionRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    if (field === 'type') setOpenDropdownId(null);
  };

  const incrementField = (id: string, field: 'count' | 'marks') => {
    setQuestionRows(
      questionRows.map((r) =>
        r.id === id ? { ...r, [field]: r[field] + 1 } : r
      )
    );
  };

  const decrementField = (id: string, field: 'count' | 'marks') => {
    setQuestionRows(
      questionRows.map((r) =>
        r.id === id ? { ...r, [field]: Math.max(1, r[field] - 1) } : r
      )
    );
  };

  const totalQuestions = questionRows.reduce((acc, r) => acc + r.count, 0);
  const totalMarks = questionRows.reduce((acc, r) => acc + r.marks, 0);

  // ── Submit ──
  const handleSubmit = async () => {
    try {
      const assignmentId = await createAssignment({
        title: `Assignment – ${new Date().toLocaleDateString()}`,
        dueDate,
        questionTypes: questionRows.map((r) => r.type),
        totalQuestions,
        totalMarks,
        instructions: additionalInfo,
        fileName: file?.name,
        fileContent,
      });
      router.push(`/assignment/${assignmentId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" />
          <h1 className="text-2xl font-bold text-foreground">
            Create Assignment
          </h1>
        </div>
        <p className="text-sm text-muted">
          Set up a new assignment for your students
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-border rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
        {/* Card Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Assignment Details
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Basic information about your assignment
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-[#1A1A1A] bg-background'
                    : file
                    ? 'border-[#22C55E] bg-green-50/30'
                    : 'border-[#D1D5DB] bg-[#FAFAFA] hover:border-muted'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.txt,.md"
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <CloudUpload className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileContent('');
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mx-auto">
                      <CloudUpload className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Choose a file or drag &amp; drop it here
                      </p>
                      <p className="text-xs text-muted mt-1">
                        JPEG, PNG, upto 10MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center px-4 py-1.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-background transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted mt-2">
                Upload images of your preferred document/image
              </p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 focus:border-[#1A1A1A]/30 transition-all pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            {/* Question Type Section */}
            <div>
              {/* Column Headers */}
              <div className="grid grid-cols-[1fr_auto_120px_120px] gap-3 items-center mb-3">
                <span className="text-sm font-bold text-foreground">
                  Question Type
                </span>
                <span />
                <span className="text-sm font-bold text-foreground text-center">
                  No. of Questions
                </span>
                <span className="text-sm font-bold text-foreground text-center">
                  Marks
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {questionRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1fr_auto_120px_120px] gap-3 items-center"
                  >
                    {/* Dropdown Select */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === row.id ? null : row.id
                          )
                        }
                        className="w-full flex items-center justify-between bg-white border border-border rounded-xl px-3 py-2.5 text-sm text-foreground hover:border-muted transition-all"
                      >
                        <span className="truncate">{row.type}</span>
                        <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 ml-2" />
                      </button>

                      {openDropdownId === row.id && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg py-1 z-20 max-h-48 overflow-y-auto">
                          {QUESTION_TYPE_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateRow(row.id, 'type', opt)}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-background transition-colors ${
                                row.type === opt
                                  ? 'font-semibold text-foreground bg-background'
                                  : 'text-muted'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeQuestionRow(row.id)}
                      className="p-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      disabled={questionRows.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Count Stepper */}
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementField(row.id, 'count')}
                        className="px-2.5 py-2 text-muted hover:bg-background transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold text-foreground tabular-nums">
                        {row.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementField(row.id, 'count')}
                        className="px-2.5 py-2 text-muted hover:bg-background transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Marks Stepper */}
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementField(row.id, 'marks')}
                        className="px-2.5 py-2 text-muted hover:bg-background transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold text-foreground tabular-nums">
                        {row.marks}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementField(row.id, 'marks')}
                        className="px-2.5 py-2 text-muted hover:bg-background transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Row Button */}
              <button
                type="button"
                onClick={addQuestionRow}
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#22C55E] hover:text-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question Type
              </button>

              {/* Totals */}
              <div className="flex items-center justify-end gap-6 mt-4 text-sm">
                <span className="text-muted">
                  Total Questions:{' '}
                  <span className="font-bold text-foreground">
                    {totalQuestions}
                  </span>
                </span>
                <span className="text-muted">
                  Total Marks:{' '}
                  <span className="font-bold text-foreground">
                    {totalMarks}
                  </span>
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Additional Information{' '}
                <span className="font-normal text-muted">
                  (For better output)
                </span>
              </label>
              <div className="relative">
                <textarea
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  rows={4}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 focus:border-[#1A1A1A]/30 transition-all resize-none pr-10"
                />
                <Mic className="absolute right-3 bottom-3 w-4 h-4 text-muted" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Summary / Review step */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">
                Review Your Assignment
              </h3>

              <div className="bg-background rounded-xl p-4 space-y-3 text-sm">
                {file && (
                  <div className="flex justify-between">
                    <span className="text-muted">File</span>
                    <span className="font-medium text-foreground">
                      {file.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Due Date</span>
                  <span className="font-medium text-foreground">
                    {dueDate || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Questions</span>
                  <span className="font-medium text-foreground">
                    {totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Marks</span>
                  <span className="font-medium text-foreground">
                    {totalMarks}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <span className="text-muted block mb-2">
                    Question Types:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {questionRows.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-border rounded-lg text-xs font-medium text-foreground"
                      >
                        {r.type}
                        <span className="text-muted ml-1">
                          ({r.count}q, {r.marks}m)
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                {additionalInfo && (
                  <div className="border-t border-border pt-3">
                    <span className="text-muted block mb-1">
                      Additional Info:
                    </span>
                    <p className="text-foreground text-sm">
                      {additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else router.back();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors"
            >
              Create Assignment
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
