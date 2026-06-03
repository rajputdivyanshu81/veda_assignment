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
      <section className="px-4 pb-16 lg:pb-32 relative z-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard UI Mockup Wrapper */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 bg-white aspect-[16/9] flex items-center justify-center bg-gray-50/50">
            {/* We recreate a stylized version of the dashboard from the screenshot */}
            <div className="w-full h-full p-4 sm:p-8 flex flex-col">
              {/* Header inside mockup */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
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
                    <div className="w-full h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-medium mb-6 text-sm">
                       + Create Assignment
                    </div>
                    <div className="space-y-3">
                       <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                       <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                       <div className="h-8 bg-gray-200 rounded-md w-5/6"></div>
                    </div>
                 </div>

                 {/* Main Area */}
                 <div className="flex-1 flex flex-col gap-6">
                    <div className="font-semibold text-gray-800 text-lg">
                       Hi Madhur 👋<br/>
                       <span className="text-sm font-normal text-gray-500">Welcome Back, Ready to create your next assignment?</span>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex gap-4">
                       <div className="flex-1 bg-[#2C2F33] rounded-2xl p-5 border border-gray-700 text-white flex justify-between items-center relative overflow-hidden">
                          <div>
                             <div className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">Assignment<br/>Reviewed in<br/>last 30 days</div>
                          </div>
                          <div className="relative w-24 h-12 flex justify-center">
                             <div className="absolute w-24 h-24 border-[12px] border-orange-500 border-b-transparent rounded-full -bottom-12"></div>
                             <div className="absolute bottom-1 font-bold text-2xl">67<span className="text-[10px] block font-normal text-gray-400 -mt-1">of 80</span></div>
                          </div>
                       </div>
                       <div className="flex-1 bg-[#2C2F33] rounded-2xl p-5 border border-gray-700 text-white flex flex-col justify-center relative overflow-hidden">
                          <div className="text-xs text-gray-400 mb-1 font-medium">Time Saved By AI</div>
                          <div className="text-3xl font-bold mb-1">31.7 hrs</div>
                          <div className="text-[10px] text-gray-400">8.5 hrs more than last month ↗</div>
                       </div>
                       <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-200 text-gray-800 flex flex-col justify-center shadow-sm">
                          <div className="text-xs text-gray-500 mb-1 font-medium">Total Assignments Graded</div>
                          <div className="text-3xl font-bold mb-1 text-gray-900">128</div>
                          <div className="text-[10px] text-gray-400">Submitted, pending evaluation</div>
                       </div>
                    </div>
                    
                    {/* Recent Assignments Header */}
                    <div className="flex justify-between items-center mt-2">
                       <div className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> Recent Assignments
                       </div>
                       <div className="text-xs text-gray-500 font-medium">View All &gt;</div>
                    </div>
                    
                    {/* Recent Assignments Cards */}
                    <div className="flex gap-4">
                       <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <div className="font-bold text-gray-800 flex items-center gap-2">Assignment on Motion <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Active</span></div>
                                <div className="text-[10px] text-gray-500">Class 10-A • Science</div>
                             </div>
                             <div className="text-gray-400 text-lg">⋮</div>
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="font-bold text-xl text-gray-800">50/50 <span className="text-[10px] font-normal text-gray-500">Submitted</span></div>
                             <div className="text-[10px] text-gray-500 text-right">
                                <div>Assigned on: 20-08-2025</div>
                                <div className="font-semibold text-gray-700 mt-0.5">Due: 21-08-2025</div>
                             </div>
                          </div>
                          <div className="w-full h-1 bg-gray-100 mt-4 rounded-full overflow-hidden">
                             <div className="w-full h-full bg-orange-500 rounded-full"></div>
                          </div>
                       </div>
                       
                       <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <div className="font-bold text-gray-800 flex items-center gap-2">Quiz on Electricity <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">Closed</span></div>
                                <div className="text-[10px] text-gray-500">Class 10-A • Science</div>
                             </div>
                             <div className="text-gray-400 text-lg">⋮</div>
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="font-bold text-xl text-gray-800">47/50 <span className="text-[10px] font-normal text-gray-500">Submitted</span></div>
                             <div className="text-[10px] text-gray-500 text-right">
                                <div>Assigned on: 20-08-2025</div>
                                <div className="font-semibold text-gray-700 mt-0.5">Due: 21-08-2025</div>
                             </div>
                          </div>
                          <div className="w-full h-1 bg-gray-100 mt-4 rounded-full overflow-hidden">
                             <div className="w-[94%] h-full bg-orange-500 rounded-full"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Fade out bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══ AI ASSESSMENT GRADER INTRO ═══ */}
      <section className="py-20 px-4 bg-[#FDFDFD]">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight mb-6 text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            VedaAI is an AI Academic Assessment system<br />
            that enables educational institutions to deliver<br />
            stronger academic results, increase parent<br />
            confidence, and build long-term institutional<br />
            reputation.
          </h2>
        </div>
      </section>

      {/* ═══ WHAT VEDAAI ENABLES SECTION ═══ */}
      <section className="py-20 lg:py-32 px-4 bg-[#FDFDFD]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1A1A]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              What VedaAI Enables
            </h2>
            <p className="text-lg text-[#505050] leading-relaxed">
              VedaAI automates grading, delivers structured feedback, and provides deep
              learning analytics helping institutions scale quality education effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-gray-50 rounded-2xl aspect-[4/3] mb-8 border border-gray-100 overflow-hidden relative flex flex-col p-4">
                  {/* Mockup for Dashboard */}
                  <div className="flex justify-between items-center mb-4">
                     <div className="w-1/3 h-4 bg-gray-200 rounded-full"></div>
                     <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex gap-2 mb-4">
                     <div className="flex-1 bg-gray-800 rounded-xl p-2 h-16"></div>
                     <div className="flex-1 bg-gray-800 rounded-xl p-2 h-16"></div>
                     <div className="flex-1 bg-white border border-gray-200 rounded-xl p-2 h-16"></div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl"></div>
               </div>
               <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">Turn Data into Actionable Insights</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                 Visualize class trends, identify learning gaps, and make data-backed academic decisions.
               </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-gray-50 rounded-2xl aspect-[4/3] mb-8 border border-gray-100 overflow-hidden relative flex flex-col p-6">
                  {/* Mockup for Student Search */}
                  <div className="w-full h-10 bg-white border border-gray-200 rounded-lg mb-6 flex items-center px-3">
                     <span className="text-sm text-gray-800">Aarav</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">Search results</div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">Aarav Sharma</div>
                        <div className="text-xs text-gray-500">Class 10</div>
                     </div>
                     <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">High</div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">Aarav Singh</div>
                        <div className="text-xs text-gray-500">Class 8</div>
                     </div>
                     <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Average</div>
                  </div>
               </div>
               <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">Access Student Performance Instantly</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                 Search any student and instantly view grades, feedback, and performance indicators.
               </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-gray-50 rounded-2xl aspect-[4/3] mb-8 border border-gray-100 overflow-hidden relative flex items-center justify-center p-6">
                  {/* Mockup for Grading */}
                  <div className="relative w-3/4 h-full bg-white shadow-sm border border-gray-200 p-4 rounded text-[8px] text-gray-400 leading-tight">
                     <div className="w-full h-2 bg-gray-200 mb-2 rounded"></div>
                     <div className="w-5/6 h-2 bg-gray-200 mb-2 rounded"></div>
                     <div className="w-full h-2 bg-gray-200 mb-4 rounded"></div>
                     {/* Scanner line */}
                     <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-orange-500 shadow-[0_0_8px_2px_rgba(255,128,0,0.5)]"></div>
                     {/* Scanner brackets */}
                     <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl-lg"></div>
                     <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr-lg"></div>
                     <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl-lg"></div>
                     <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br-lg"></div>
                  </div>
               </div>
               <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">AI-powered grading in seconds</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                 Evaluate entire class submissions accurately while providing detailed student-specific feedback.
               </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-gray-50 rounded-2xl aspect-[4/3] mb-8 border border-gray-100 overflow-hidden relative flex flex-col p-6">
                  {/* Mockup for Stats */}
                  <div className="text-xs font-bold text-center mb-4">Overall Class Performance Summary</div>
                  <div className="flex gap-2">
                     <div className="flex-1 bg-gray-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="text-[10px] text-gray-400">Submissions</div>
                        <div className="w-full h-12 relative mt-2">
                           <div className="absolute bottom-0 w-full h-full border-t-4 border-l-4 border-r-4 border-orange-500 rounded-t-full"></div>
                        </div>
                     </div>
                     <div className="flex-1 grid grid-cols-1 gap-2">
                        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                           <div className="text-xl font-bold text-green-500">82%</div>
                           <div className="text-[10px] text-gray-500">Average Score</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                           <div className="text-xl font-bold text-red-500">95%</div>
                           <div className="text-[10px] text-gray-500">Top Score</div>
                        </div>
                     </div>
                  </div>
               </div>
               <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">Deep Performance Analytics</h3>
               <p className="text-gray-500 leading-relaxed text-sm">
                 Monitor overall class health, identify top performers, and support struggling students proactively.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUSTED BY SECTION ═══ */}
      <section className="py-12 border-t border-gray-100 bg-[#FDFDFD]">
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

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-24 lg:py-32 px-4 bg-[#FDFDFD]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#1A1A1A] flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-6xl leading-none">V</span>
            </div>
            <div className="absolute -top-6 -right-6 text-6xl rotate-12 drop-shadow-lg">
              👑
            </div>
          </div>
          
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1A1A]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            See How VedaAI Works for Your School
          </h2>
          
          <p className="text-[#505050] mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Experience how VedaAI can improve results, strengthen parent confidence, 
            and deliver measurable academic impact.
          </p>
          
          <Link
            href="/sign-up"
            className="group inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-black text-white font-semibold px-10 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-xl"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="pt-16 pb-8 px-4 bg-[#FDFDFD] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Top section with logo and links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 relative z-10">
            {/* Logo & Tagline */}
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center mb-4">
                <span className="text-white font-black text-2xl leading-none">V</span>
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-lg mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>VedaAI</h3>
              <p className="text-[#888888] text-sm">Grade assignments in minutes not in hours</p>
            </div>

            {/* Links Column */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[#888888] text-sm mb-1">Links</h4>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Home</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Solutions</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">About Us</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Career</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Blogs</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">For Teachers</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Be a Partner</a>
            </div>

            {/* Connect Column */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[#888888] text-sm mb-1">Connect</h4>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">LinkedIn</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">X</a>
              <a href="#" className="text-[#1A1A1A] text-sm font-medium hover:text-[#FF8000] transition-colors">Instagram</a>
            </div>
          </div>

          {/* Giant Watermark Text */}
          <div className="w-full flex justify-center items-center mb-8 pointer-events-none select-none overflow-hidden">
            <span 
              className="text-[25vw] sm:text-[18vw] font-black text-[#A0A0A0] leading-none tracking-tighter opacity-80"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              VedaAI
            </span>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 relative z-10 pt-4 border-t border-transparent">
            <div className="text-[#A0A0A0] text-xs font-medium">
              <p>© 2026 Vedafy Technologies Pvt. Ltd.</p>
              <p>All rights reserved</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-[#A0A0A0] text-xs font-medium">
              <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors">Sustainability</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
