'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../../store/assignmentStore';
import { useSocket } from '../../../hooks/useSocket';
import { FileDown, RefreshCw, ChevronLeft, Calendar, FileText, CheckSquare, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function AssignmentOutput() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // Zustand state and actions
  const fetchAssignmentResult = useAssignmentStore((state) => state.fetchAssignmentResult);
  const currentAssignment = useAssignmentStore((state) => state.currentAssignment);
  const currentPaper = useAssignmentStore((state) => state.currentPaper);
  const isLoadingResult = useAssignmentStore((state) => state.isLoadingResult);
  const isGenerating = useAssignmentStore((state) => state.isGenerating);
  const generationProgress = useAssignmentStore((state) => state.generationProgress);
  const generationMessage = useAssignmentStore((state) => state.generationMessage);
  const error = useAssignmentStore((state) => state.error);
  const setGenerating = useAssignmentStore((state) => state.setGenerating);
  const regenerateAssignment = useAssignmentStore((state) => state.regenerateAssignment);

  // Initialize socket room connection to track regeneration updates in real-time
  useSocket(id, () => {
    // When sockets reports regeneration completed, reload result
    fetchAssignmentResult(id);
  });

  useEffect(() => {
    if (id) {
      fetchAssignmentResult(id);
    }
  }, [id, fetchAssignmentResult]);

  const handleDownloadPDF = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.open(`${API_URL}/api/assignments/${id}/pdf`, '_blank');
  };

  const handleRegenerate = async () => {
    if (confirm('Are you sure you want to regenerate this question paper? This will overwrite the current questions.')) {
      try {
        await regenerateAssignment(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoadingResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading exam question paper details...</p>
      </div>
    );
  }

  if (!currentAssignment) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-4">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center">
          <p className="text-red-400 font-semibold mb-4">Assignment not found</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all"
          >
            Go back Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate difficulty distribution for statistics badge
  let easyCount = 0;
  let modCount = 0;
  let hardCount = 0;
  
  if (currentPaper?.sections) {
    currentPaper.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (q.difficulty === 'Easy') easyCount++;
        else if (q.difficulty === 'Moderate') modCount++;
        else if (q.difficulty === 'Hard') hardCount++;
      });
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans flex flex-col items-center selection:bg-indigo-500 selection:text-white">
      {/* Background radial highlights */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-violet-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Navigation bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 bg-slate-900/40 border border-slate-850 hover:border-slate-800 px-3.5 py-2 rounded-xl transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Create New
        </button>

        {currentPaper && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-350 hover:text-slate-100 bg-slate-900/40 border border-slate-850 hover:border-slate-800 px-3.5 py-2 rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/10"
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Metadata Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Exam Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Exam Title</span>
                <span className="font-semibold text-slate-200 mt-0.5 truncate">{currentAssignment.title}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Total Marks</span>
                <span className="font-semibold text-slate-200 mt-0.5">{currentAssignment.totalMarks} Marks</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Total Questions</span>
                <span className="font-semibold text-slate-200 mt-0.5">{currentAssignment.totalQuestions} Questions</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Due Date</span>
                <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {new Date(currentAssignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {currentPaper && (
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Difficulty Balance</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Easy</span>
                    <span>{easyCount} qs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(easyCount/currentAssignment.totalQuestions)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Moderate</span>
                    <span>{modCount} qs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(modCount/currentAssignment.totalQuestions)*100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Hard</span>
                    <span>{hardCount} qs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${(hardCount/currentAssignment.totalQuestions)*100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Paper Preview Sheet */}
        <div className="lg:col-span-3">
          <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl relative border border-slate-100 min-h-[842px] flex flex-col justify-between">
            {/* Watermark/Sparkle */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-20 text-indigo-700 flex items-center gap-1.5 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Generated by VedaAI
            </div>

            <div>
              {/* Header Title */}
              <div className="text-center border-b-2 border-slate-350 pb-6 mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {currentAssignment.title}
                </h1>
                {currentAssignment.instructions && (
                  <p className="text-xs text-slate-600 font-medium italic mt-2 max-w-lg mx-auto">
                    Instructions: {currentAssignment.instructions}
                  </p>
                )}
                
                <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wide text-slate-700 mt-4 px-2">
                  <span>Questions: {currentAssignment.totalQuestions}</span>
                  <span>Max Marks: {currentAssignment.totalMarks}</span>
                </div>
              </div>

              {/* Student Details Sheet Block */}
              <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 mb-8 text-xs font-medium text-slate-700 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span>Student Name:</span>
                  <div className="flex-1 border-b border-dashed border-slate-400 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Roll Number:</span>
                  <div className="flex-1 border-b border-dashed border-slate-400 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Section:</span>
                  <div className="flex-1 border-b border-dashed border-slate-400 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Date:</span>
                  <div className="flex-1 border-b border-dashed border-slate-400 h-4" />
                </div>
              </div>

              {/* Generated Sections list */}
              {currentPaper ? (
                <div className="space-y-8">
                  {currentPaper.sections.map((section, sIdx) => (
                    <div key={section._id || sIdx} className="space-y-4">
                      {/* Section Title */}
                      <div className="border-b border-slate-300 pb-1.5">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                          {section.title}
                        </h2>
                        {section.instruction && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            {section.instruction}
                          </p>
                        )}
                      </div>

                      {/* Question items */}
                      <div className="space-y-4">
                        {section.questions.map((q, qIdx) => (
                          <div key={q._id || qIdx} className="text-xs text-slate-800 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="font-bold text-slate-900 mt-0.5">{qIdx + 1}.</span>
                                <div className="space-y-2 flex-1">
                                  <p className="font-semibold text-slate-900 leading-relaxed">
                                    {q.text}
                                  </p>
                                  
                                  {/* MCQ options list */}
                                  {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 pl-2 pt-1">
                                      {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-2 text-[11px] font-medium text-slate-650">
                                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[9px] font-bold">
                                            {String.fromCharCode(65 + oIdx)}
                                          </span>
                                          <span>{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Difficulty & Marks badges */}
                              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                <span className={`text-[9px] px-2 py-0.5 font-bold uppercase rounded-md tracking-wider ${
                                  q.difficulty === 'Easy' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : q.difficulty === 'Moderate'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-[10px] font-extrabold text-slate-800 uppercase bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {q.marks}M
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                  <p className="text-sm font-semibold">Question paper generation failed or was empty.</p>
                  <button
                    onClick={handleRegenerate}
                    className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-500 underline"
                  >
                    Try regenerating again
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-4 mt-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>VedaAI Exam System</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* WebSocket progress overlay drawer (handles regeneration spinner) */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Regenerating Question Paper
            </h3>
            <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
              Please wait. Groq LLM is recreating exam questions and updating the layout.
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
