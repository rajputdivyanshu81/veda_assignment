'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Search, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  FolderOpen, 
  Calendar,
  FileCheck,
  Award
} from 'lucide-react';

interface AssignmentItem {
  _id: string;
  title: string;
  dueDate: string;
  createdAt?: string;
  status: string;
  totalMarks: number;
  totalQuestions: number;
  fileName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LibraryPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'papers' | 'materials'>('papers');

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch(`${API_URL}/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(Array.isArray(data) ? data : data.assignments || []);
        }
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleDownloadPDF = (id: string) => {
    window.open(`${API_URL}/api/assignments/${id}/pdf`, '_blank');
  };

  // Filter completed papers
  const completedPapers = assignments.filter(
    (a) => a.status === 'completed' && a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter materials (assignments that have files uploaded)
  const studyMaterials = assignments.filter(
    (a) => a.fileName && a.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Page Header */}
      <div>
        <h1 
          className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight flex items-center gap-3"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          <Bookmark className="w-8 h-8 text-[#E8612D]" />
          My Library
        </h1>
        <p className="text-gray-500 mt-1">Access your generated assessment papers, study references, and template assets.</p>
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('papers')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'papers'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Question Papers ({completedPapers.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'materials'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Reference Uploads ({studyMaterials.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'papers' ? "Search question papers..." : "Search uploaded references..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#E8612D]/30 focus:ring-2 focus:ring-[#E8612D]/10 outline-none transition-all text-[#1A1A1A]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="w-8 h-8 border-3 border-[#E8612D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === 'papers' ? (
        completedPapers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto mt-8">
            <div className="w-16 h-16 bg-[#E8612D]/10 rounded-2xl flex items-center justify-center text-[#E8612D] mx-auto mb-6">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No Generated Papers Found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Any assessment papers you generate using the creator will be listed here for quick access and downloads.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors"
            >
              Generate Question Paper
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedPapers.map((paper) => (
              <div 
                key={paper._id} 
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl text-[#E8612D] group-hover:bg-[#E8612D]/10 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 font-medium rounded-full">
                      Ready
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-1 group-hover:text-[#E8612D] transition-colors">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Created: {formatDate(paper.createdAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-xl text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span>{paper.totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{paper.totalQuestions} Questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 border-t border-gray-50 pt-4">
                  <Link
                    href={`/assignment/${paper._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-100 hover:border-gray-200 text-[#1A1A1A] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDownloadPDF(paper._id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : studyMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto mt-8">
          <div className="w-16 h-16 bg-[#E8612D]/10 rounded-2xl flex items-center justify-center text-[#E8612D] mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No Reference Files Found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Upload text files or NCERT reference notes when creating assignments to view them stored in your library files.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors"
          >
            Create with Uploads
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyMaterials.map((material) => (
            <div 
              key={material._id} 
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl text-amber-600 group-hover:bg-amber-50 transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-medium rounded-full">
                    Reference File
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-1">
                    {material.fileName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Linked Assignment: {material.title}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-gray-50 pt-4">
                <Link
                  href={`/assignment/${material._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-100 hover:border-gray-200 text-[#1A1A1A] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Assignment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
