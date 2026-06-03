'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../../store/assignmentStore';
import { useSocket } from '../../../hooks/useSocket';
import { Download, RefreshCw, Loader2, ChevronLeft } from 'lucide-react';

export default function AssignmentOutput() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const fetchAssignmentResult = useAssignmentStore((s) => s.fetchAssignmentResult);
  const currentAssignment = useAssignmentStore((s) => s.currentAssignment);
  const currentPaper = useAssignmentStore((s) => s.currentPaper);
  const isLoadingResult = useAssignmentStore((s) => s.isLoadingResult);
  const isGenerating = useAssignmentStore((s) => s.isGenerating);
  const generationProgress = useAssignmentStore((s) => s.generationProgress);
  const generationMessage = useAssignmentStore((s) => s.generationMessage);
  const error = useAssignmentStore((s) => s.error);
  const setGenerating = useAssignmentStore((s) => s.setGenerating);
  const regenerateAssignment = useAssignmentStore((s) => s.regenerateAssignment);

  useSocket(id, () => {
    fetchAssignmentResult(id);
  });

  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [schoolCity, setSchoolCity] = useState('Sector-4, Bokaro');

  useEffect(() => {
    setSchoolName(localStorage.getItem('vedaai_school_name') || 'Delhi Public School');
    setSchoolCity(localStorage.getItem('vedaai_school_city') || 'Bokaro Steel City');
  }, []);

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
    if (confirm('Regenerate this question paper? Current questions will be replaced.')) {
      await regenerateAssignment(id);
    }
  };

  // Compute a global question counter across sections
  const getGlobalQuestionNumber = (sectionIdx: number, questionIdx: number): number => {
    if (!currentPaper) return questionIdx + 1;
    let count = 0;
    for (let i = 0; i < sectionIdx; i++) {
      count += currentPaper.sections[i].questions.length;
    }
    return count + questionIdx + 1;
  };

  if (isLoadingResult) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#E8612D] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading question paper...</p>
        </div>
      </div>
    );
  }

  if (!currentAssignment) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Assignment not found</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#333] transition-colors"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* AI Message Banner */}
      <div className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-xl p-4 mb-6">
        <p className="text-sm text-[#1A1A1A] mb-3">
          Certainly, Lakshya! Here are customized Question Paper for your{' '}
          <span className="font-semibold">{currentAssignment.title}</span> on the NCERT chapters:
        </p>
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </button>
      </div>

      {/* Question Paper Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm max-w-4xl mx-auto">
        <div className="p-8 md:p-12">
          {/* School Header */}
          <div className="text-center border-b border-[#E5E7EB] pb-6 mb-6">
            <h1 className="text-lg md:text-xl font-bold text-[#1A1A1A]">
              {schoolName}, {schoolCity}
            </h1>
            <p className="text-sm text-[#1A1A1A] mt-1">
              Subject: {currentAssignment.title}
            </p>
            <p className="text-sm text-[#1A1A1A]">Class: 5th</p>
          </div>

          {/* Time & Marks Row */}
          <div className="flex justify-between items-center mb-4 text-sm text-[#1A1A1A]">
            <span>Time Allowed: 45 minutes</span>
            <span>Maximum Marks: {currentAssignment.totalMarks}</span>
          </div>

          {/* Instructions */}
          <p className="text-sm text-[#1A1A1A] mb-6 italic">
            All questions are compulsory unless stated otherwise.
          </p>

          {/* Student Info */}
          <div className="mb-8 space-y-1.5 text-sm text-[#1A1A1A]">
            <p>Name: ____________________</p>
            <p>Roll Number: ____________________</p>
            <p>Class: 5th Section: ________</p>
          </div>

          {/* Sections */}
          {currentPaper && currentPaper.sections.length > 0 ? (
            <div className="space-y-8">
              {currentPaper.sections.map((section, sIdx) => (
                <div key={section._id || sIdx}>
                  {/* Section Title */}
                  <h2 className="text-base font-bold text-[#1A1A1A] text-center mb-4">
                    Section {String.fromCharCode(65 + sIdx)}
                  </h2>

                  {/* Section Subtitle */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {section.title}
                    </p>
                    {section.instruction && (
                      <p className="text-xs text-[#6B7280] italic">
                        {section.instruction}
                      </p>
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {section.questions.map((q, qIdx) => {
                      const globalNum = getGlobalQuestionNumber(sIdx, qIdx);
                      return (
                        <div key={q._id || qIdx} className="text-sm text-[#1A1A1A]">
                          <p>
                            <span className="font-medium">{globalNum}.</span>{' '}
                            {q.difficulty && (
                              <span className={`text-xs px-1.5 py-0.5 rounded mr-1 font-medium ${
                                q.difficulty === 'Easy'
                                  ? 'bg-green-50 text-green-700'
                                  : q.difficulty === 'Moderate'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {q.difficulty}
                              </span>
                            )}
                            {q.text}{' '}
                            <span className="text-[#6B7280]">[{q.marks} Marks]</span>
                          </p>

                          {/* MCQ Options */}
                          {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                            <div className="ml-6 mt-1.5 space-y-1">
                              {q.options.map((opt, oIdx) => (
                                <p key={oIdx} className="text-sm text-[#4B5563]">
                                  {String.fromCharCode(97 + oIdx)}. {opt}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-[#6B7280] text-sm">
                Question paper is being generated or not available.
              </p>
              <button
                onClick={handleRegenerate}
                className="mt-3 text-sm text-[#E8612D] font-medium hover:underline"
              >
                Try regenerating
              </button>
            </div>
          )}

          {/* End of Paper */}
          {currentPaper && currentPaper.sections.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#E5E7EB]">
              <p className="text-sm font-semibold text-[#1A1A1A] text-center mb-8">
                End of Question Paper
              </p>

              {/* Answer Key Section */}
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-4">Answer Key:</h3>
                <div className="space-y-3">
                  {currentPaper.sections.map((section, sIdx) =>
                    section.questions.map((q, qIdx) => {
                      const globalNum = getGlobalQuestionNumber(sIdx, qIdx);
                      return (
                        <div key={`ans-${sIdx}-${qIdx}`} className="text-sm text-[#4B5563]">
                          <p>
                            <span className="font-medium text-[#1A1A1A]">{globalNum}.</span>{' '}
                            {q.type === 'MCQ'
                              ? `The correct answer relates to the key concepts of ${currentAssignment.title}.`
                              : `A comprehensive answer should cover the fundamental principles discussed in ${currentAssignment.title}.`}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regenerate floating button */}
      {currentPaper && (
        <div className="flex justify-center mt-6 mb-8">
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#1A1A1A] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      )}

      {/* Generation Progress Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
            <div className="w-14 h-14 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#E8612D] rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
              {currentPaper ? 'Regenerating' : 'Generating'} Question Paper
            </h3>
            <p className="text-sm text-[#6B7280] mb-5">
              Please wait while AI creates your assessment...
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[#E8612D] transition-all duration-500 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#6B7280]">
              {generationMessage || 'Processing...'} ({generationProgress}%)
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {error}
                <button
                  onClick={() => setGenerating(false)}
                  className="ml-2 underline font-medium"
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
