'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full flex-1 bg-[#FDFDFD] text-[#1A1A1A] overflow-x-hidden" style={{ fontFamily: "'Inter', 'Figtree', sans-serif" }}>
      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                <span className="text-white font-black text-xl leading-none">V</span>
              </div>
              <span
                className="text-2xl font-bold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                VedaAI
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 font-medium">
              <a href="#" className="text-sm text-[#1A1A1A] hover:text-[#FF8000] transition-colors">Home</a>
              <a href="#" className="text-sm text-[#404040] hover:text-[#FF8000] transition-colors">Solutions</a>
              <a href="#" className="text-sm text-[#404040] hover:text-[#FF8000] transition-colors">Teachers</a>
              <a href="#" className="text-sm text-[#404040] hover:text-[#FF8000] transition-colors">About Us</a>
              <a href="#" className="text-sm text-[#404040] hover:text-[#FF8000] transition-colors">Careers</a>
              <a href="#" className="text-sm text-[#404040] hover:text-[#FF8000] transition-colors">Blogs</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full transition-colors shadow-md"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[#1A1A1A] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4 shadow-lg absolute w-full">
            <a href="#" className="block text-sm font-medium text-[#1A1A1A]" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#" className="block text-sm font-medium text-[#404040]" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
            <a href="#" className="block text-sm font-medium text-[#404040]" onClick={() => setMobileMenuOpen(false)}>Teachers</a>
            <a href="#" className="block text-sm font-medium text-[#404040]" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <Link href="/sign-up" className="block text-sm text-center font-semibold bg-[#1A1A1A] text-white py-3 rounded-xl mt-4">Contact Us</Link>
          </div>
        )}
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-36 lg:pt-44 pb-16 lg:pb-24 px-4 overflow-hidden">
        {/* Background gradient blob (light blue/gray) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-b from-[#E6F4FF]/60 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* IIM Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-8">
            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-red-700">IIM</span>
            </div>
            <span className="text-sm font-medium text-[#404040]">Incubated at IIM Bangalore</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-[2.5rem] sm:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-[#1A1A1A]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            AI Academic Assessment &<br />
            <span className="inline-block bg-[#FFF0E5] text-[#FF6B00] px-4 py-1 mt-2 rounded-2xl">
              Intelligence System
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#505050] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            An AI academic system for assessment, teaching, and personalised learning - designed to improve
            academic outcomes, reduce cost & time, and strengthen institutional credibility.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center">
            <Link
              href="/sign-in"
              className="group inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all shadow-lg hover:shadow-xl"
            >
              Book a meeting
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ MOCKUP IMAGE SECTION ═══ */}
      <section className="px-4 pb-16 lg:pb-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard UI Mockup Wrapper */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-white aspect-[16/9] flex items-center justify-center bg-gray-50">
            {/* We recreate a stylized version of the dashboard from the screenshot */}
            <div className="w-full h-full p-4 sm:p-8 flex flex-col">
              {/* Header inside mockup */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FF8000] flex items-center justify-center">
                      <span className="text-white font-bold">V</span>
                    </div>
                    <span className="font-bold text-lg">VedaAI</span>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-24 h-8 bg-gray-100 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                 </div>
              </div>

              {/* Main Content inside mockup */}
              <div className="flex-1 flex gap-6">
                 {/* Sidebar */}
                 <div className="w-64 bg-gray-50 rounded-2xl p-4 hidden md:block">
                    <div className="w-full h-10 bg-black text-white rounded-xl flex items-center justify-center font-medium mb-6 text-sm">
                       + Create Assignment
                    </div>
                    <div className="space-y-3">
                       <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                       <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                       <div className="h-8 bg-gray-200 rounded-md w-5/6"></div>
                    </div>
                 </div>

                 {/* Main Area */}
                 <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-6 shadow-sm">
                    <div className="font-semibold text-gray-800">Overall Class Performance Summary</div>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                          <div className="text-3xl font-bold text-green-500 mb-1">82%</div>
                          <div className="text-xs text-gray-500">Average Score</div>
                       </div>
                       <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                          <div className="text-3xl font-bold text-red-500 mb-1">95%</div>
                          <div className="text-xs text-gray-500">Submission Rate</div>
                       </div>
                    </div>
                    <div className="font-semibold text-gray-800 mt-4">Learning Gaps Analysis</div>
                    <div className="flex-1 bg-red-50/50 rounded-xl p-4 border border-red-100">
                       <div className="text-sm font-medium mb-3">Frequently missed concepts</div>
                       <div className="flex justify-between items-center text-sm mb-2">
                          <span>1. Ohm's Law Application</span>
                          <span className="text-red-500 font-bold">23%</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span>2. Circuit Diagrams</span>
                          <span className="text-red-500 font-bold">18%</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Fade out bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══ TRUSTED BY SECTION ═══ */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base font-medium text-gray-500 mb-8">Trusted and Backed by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos placeholders */}
            <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
              <span className="w-6 h-6 rounded bg-gray-400 block"></span> Startups
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
              aws <span className="font-light">startups</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-400">
              <span className="w-6 h-6 bg-gray-400 rounded-sm block"></span> Microsoft <span className="font-light text-sm mt-1 block">for Startups</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-gray-400">
              <div className="grid grid-cols-3 gap-0.5">
                 <div className="w-1.5 h-1.5 bg-gray-400"></div><div className="w-1.5 h-1.5 bg-gray-400"></div><div className="w-1.5 h-1.5 bg-gray-400"></div>
                 <div className="w-1.5 h-1.5 bg-gray-400"></div><div className="w-1.5 h-1.5 bg-transparent"></div><div className="w-1.5 h-1.5 bg-gray-400"></div>
                 <div className="w-1.5 h-1.5 bg-gray-400"></div><div className="w-1.5 h-1.5 bg-gray-400"></div><div className="w-1.5 h-1.5 bg-gray-400"></div>
              </div>
              <div className="text-left leading-tight"><span className="block text-sm">Perplexity</span><span className="block text-[10px] font-normal">AI Business Fellowship</span></div>
            </div>
            <div className="font-bold text-2xl text-gray-400">Google</div>
          </div>
        </div>
      </section>
      
      {/* ═══ SIMPLE FOOTER ═══ */}
      <footer className="py-8 text-center text-sm text-gray-400">
         © 2025 VedaAI. All rights reserved.
      </footer>
    </div>
  );
}
