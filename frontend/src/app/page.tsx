'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileSearch,
  FileText,
  Eye,
  Trash2,
} from 'lucide-react';

interface AssignmentItem {
  _id: string;
  title: string;
  dueDate: string;
  createdAt?: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('vedaai_token');
    return null;
  };

  useEffect(() => {
    async function fetchAssignments() {
      const token = getToken();
      try {
        const res = await fetch(`${API_URL}/api/assignments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setAssignments(Array.isArray(data) ? data : data.assignments || []);
        }
      } catch {
        // Gracefully handle — show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/assignments/${id}`, { method: 'DELETE' });
      setAssignments((prev) => prev.filter((a) => a._id !== id));
      window.dispatchEvent(new Event('assignments-changed'));
    } catch {
      // handle error
    }
    setOpenMenuId(null);
  };

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Empty State ──
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
        {/* Premium Graphic Container */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6 select-none">
          {/* Background circle */}
          <div className="absolute w-48 h-48 bg-[#F3F4F6] rounded-full" />
          
          {/* Decorative Swirl (Left) */}
          <svg className="absolute left-6 top-14 w-12 h-12 text-[#9CA3AF] opacity-80" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 35C30 35 15 28 20 18C25 8 35 12 30 22C25 32 10 22 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>

          {/* Decorative Sparkle (Bottom Left) */}
          <svg className="absolute left-16 bottom-10 w-6 h-6 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>

          {/* Decorative Blue Dot (Right) */}
          <div className="absolute right-12 top-28 w-3 h-3 bg-[#2563EB] rounded-full" />

          {/* Floating Small Card (Top Right) */}
          <div className="absolute right-10 top-12 w-14 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-1.5 px-2 z-10">
            <div className="w-2 h-2 bg-[#9CA3AF] rounded-full" />
            <div className="w-6 h-2 bg-gray-200 rounded-sm" />
          </div>

          {/* Main Document (Center) */}
          <div className="relative w-28 h-36 bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col gap-3 transform -translate-x-2 -translate-y-1">
            <div className="w-10 h-2 bg-[#0F172A] rounded-sm" />
            <div className="w-16 h-1.5 bg-gray-200 rounded-sm" />
            <div className="w-12 h-1.5 bg-gray-200 rounded-sm" />
            <div className="w-18 h-1.5 bg-gray-200 rounded-sm" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-sm" />
          </div>

          {/* Magnifying Glass with Red Cross */}
          <div className="absolute right-10 bottom-8 flex items-center justify-center">
            {/* Handle */}
            <div className="absolute w-5 h-14 bg-[#CBD5E1] rounded-full transform rotate-[-45deg] translate-x-8 translate-y-8" />
            
            {/* Lens Ring */}
            <div className="relative w-24 h-24 bg-white/90 border-4 border-[#CBD5E1] rounded-full flex items-center justify-center shadow-lg">
              {/* Red Cross */}
              <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Text Contents */}
        <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-2 font-sans">
          No assignments yet
        </h2>
        <p className="text-sm md:text-base text-gray-500 max-w-lg mb-8 leading-relaxed px-4">
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let AI
          assist with grading.
        </p>

        {/* Action Button */}
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-[#111827] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-black transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Your First Assignment
        </Link>
      </div>
    );
  }

  // ── Populated State ──
  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" />
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
        </div>
        <p className="text-sm text-muted">
          Manage and create assignments for your classes.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium text-muted hover:bg-white hover:text-foreground transition-colors">
          <Filter className="w-4 h-4" />
          Filter By
        </button>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 focus:border-[#1A1A1A]/30 transition-all"
          />
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-card rounded-xl p-5 shadow-sm border border-border relative group"
          >
            {/* Title & Menu */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted" />
                </div>
                <h3 className="text-base font-bold text-foreground leading-tight">
                  {assignment.title}
                </h3>
              </div>

              {/* Three-dot menu */}
              <div className="relative" ref={openMenuId === assignment._id ? menuRef : undefined}>
                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === assignment._id ? null : assignment._id
                    )
                  }
                  className="p-1.5 rounded-lg hover:bg-background transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-muted" />
                </button>

                {openMenuId === assignment._id && (
                  <div className="absolute right-0 top-8 w-44 bg-white border border-border rounded-xl shadow-lg py-1 z-20">
                    <Link
                      href={`/assignment/${assignment._id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background transition-colors"
                    >
                      <Eye className="w-4 h-4 text-muted" />
                      View Assignment
                    </Link>
                    <button
                      onClick={() => handleDelete(assignment._id)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                Assigned on:{' '}
                {formatDate(assignment.createdAt || new Date().toISOString())}
              </span>
              <span>Due: {formatDate(assignment.dueDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Create Button */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-30">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#333] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>
    </div>
  );
}
