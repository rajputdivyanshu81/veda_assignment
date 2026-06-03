'use client';

import { useRouter } from 'next/navigation';
import { MonitorPlay, Hammer, ArrowLeft, Construction, Sparkles } from 'lucide-react';

export default function ToolkitPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50 min-h-[80vh]">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E8612D]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Construction / Toolkit Icon Stack */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-[#E8612D]/10 rounded-full animate-ping opacity-75 duration-1000" />
          <div className="absolute inset-0 bg-[#E8612D]/5 rounded-full animate-pulse" />
          <div className="relative bg-white border border-[#E8612D]/20 shadow-md p-5 rounded-2xl text-[#E8612D]">
            <MonitorPlay className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#1A1A1A] text-white p-2 rounded-xl shadow-md border border-white">
            <Sparkles className="w-4 h-4 animate-spin duration-3000" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8612D]/10 text-[#E8612D]">
            <Construction className="w-3.5 h-3.5" />
            Under Construction
          </span>
          <h1 
            className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            AI Teacher's Toolkit
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            We are designing advanced AI modules including custom question bank databases, lesson planning helpers, and auto-rubrics generators. Coming soon!
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="pt-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
