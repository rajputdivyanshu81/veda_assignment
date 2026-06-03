'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  Zap,
  FileText,
  BarChart3,
  RefreshCw,
  Activity,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Star,
  GraduationCap,
  School,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden" style={{ fontFamily: "'Figtree', 'Geist', sans-serif" }}>
      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF8000] flex items-center justify-center">
                <span className="text-white font-extrabold text-lg leading-none">V</span>
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                VedaAI
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                How it Works
              </a>
              <a href="#stats" className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                About
              </a>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors px-4 py-2"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-[#FF8000] hover:bg-[#E67300] text-white px-5 py-2.5 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#141414] border-t border-[#2A2A2A] px-4 py-6 space-y-4">
            <a href="#features" className="block text-sm text-[#A0A0A0] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-[#A0A0A0] hover:text-white" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#stats" className="block text-sm text-[#A0A0A0] hover:text-white" onClick={() => setMobileMenuOpen(false)}>About</a>
            <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
              <Link href="/sign-in" className="block text-sm text-center text-white py-2.5 border border-[#2A2A2A] rounded-xl">Log In</Link>
              <Link href="/sign-up" className="block text-sm text-center font-semibold bg-[#FF8000] text-white py-2.5 rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-32 lg:pt-44 pb-20 lg:pb-32 px-4">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FF8000]/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF8000]/10 border border-[#FF8000]/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-[#FF8000]" />
            <span className="text-xs font-medium text-[#FF8000]">Trusted by 500+ educators worldwide</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            AI-Powered Assessment
            <br />
            <span className="bg-gradient-to-r from-[#FF8000] via-[#FF9933] to-[#FFB366] bg-clip-text text-transparent">
              Creator for Educators
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#737373] max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate professional question papers in minutes, not hours. Advanced AI creates
            structured, balanced assessments tailored to your curriculum and standards.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 bg-[#FF8000] hover:bg-[#E67300] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-[#FF8000]/25"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-[#2A2A2A] hover:border-[#444] text-white font-medium px-8 py-3.5 rounded-full text-sm transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof avatars */}
          <div className="flex items-center justify-center gap-3 mt-12">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=teacher${i}`}
                    alt=""
                    className="w-full h-full object-cover bg-[#2A2A2A]"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FF8000] text-[#FF8000]" />
              ))}
            </div>
            <span className="text-xs text-[#737373]">4.9/5 from 200+ reviews</span>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="py-20 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#FF8000] bg-[#FF8000]/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Features
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Everything you need to create
              <br className="hidden sm:block" />
              <span className="text-[#737373]"> perfect assessments</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: 'AI Question Generation',
                desc: 'Generate balanced, curriculum-aligned questions using advanced AI models like Llama 3.3.',
                color: '#FF8000',
              },
              {
                icon: Activity,
                title: 'Real-time Progress',
                desc: 'Watch your assessment being created in real-time with live WebSocket progress updates.',
                color: '#22C55E',
              },
              {
                icon: FileText,
                title: 'Multiple Question Types',
                desc: 'Support for MCQs, short answers, long answers, diagrams, and numerical problems.',
                color: '#3B82F6',
              },
              {
                icon: Zap,
                title: 'PDF Export',
                desc: 'Download professional, print-ready question papers with a single click.',
                color: '#A855F7',
              },
              {
                icon: BarChart3,
                title: 'Smart Distribution',
                desc: 'AI automatically distributes difficulty levels and marks across sections.',
                color: '#EAB308',
              },
              {
                icon: RefreshCw,
                title: 'Instant Regeneration',
                desc: 'Not satisfied? Regenerate any assessment instantly with one click.',
                color: '#EC4899',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all hover:-translate-y-1 duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-20 lg:py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF8000]/3 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#FF8000] bg-[#FF8000]/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              How It Works
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Create assessments in
              <span className="text-[#FF8000]"> 3 simple steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Configure Your Assessment',
                desc: 'Set question types, marks distribution, difficulty levels, and upload any reference material.',
              },
              {
                step: '02',
                title: 'AI Generates Questions',
                desc: 'Our Groq-powered AI engine creates structured, balanced question papers in seconds.',
              },
              {
                step: '03',
                title: 'Review & Download',
                desc: 'Preview your assessment with answer keys, make adjustments, and download as a print-ready PDF.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-[#141414] border border-[#2A2A2A] rounded-2xl p-7 group hover:border-[#FF8000]/30 transition-all duration-300"
              >
                <span
                  className="text-5xl font-black text-[#FF8000]/10 absolute top-5 right-6"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#FF8000] flex items-center justify-center text-white font-bold text-sm mb-5">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#FF8000]/10 via-[#FF8000]/5 to-[#FF8000]/10 border border-[#FF8000]/20 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, value: '500+', label: 'Educators' },
                { icon: FileText, value: '10,000+', label: 'Assessments Created' },
                { icon: School, value: '50+', label: 'Schools' },
                { icon: Star, value: '4.9/5', label: 'Satisfaction' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <stat.icon className="w-6 h-6 text-[#FF8000] mx-auto mb-3" />
                  <div
                    className="text-2xl sm:text-3xl font-bold mb-1"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#737373]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-12 h-12 text-[#FF8000] mx-auto mb-6" />
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Ready to transform your
            <br />
            assessment workflow?
          </h2>
          <p className="text-[#737373] mb-8 max-w-lg mx-auto">
            Join hundreds of educators already using VedaAI to save hours on assessment creation
            and focus on what matters most — teaching.
          </p>
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 bg-[#FF8000] hover:bg-[#E67300] text-white font-semibold px-8 py-4 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-[#FF8000]/25"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-[#737373]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Instant setup</span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#1A1A1A] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FF8000] flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm leading-none">V</span>
                </div>
                <span className="text-lg font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  VedaAI
                </span>
              </div>
              <p className="text-sm text-[#737373] max-w-xs leading-relaxed">
                AI-powered platform empowering educators to create professional assessments
                in minutes, not hours.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-sm text-[#737373] hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block text-sm text-[#737373] hover:text-white transition-colors">How it Works</a>
                <a href="#stats" className="block text-sm text-[#737373] hover:text-white transition-colors">About</a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Account</h4>
              <div className="space-y-3">
                <Link href="/sign-in" className="block text-sm text-[#737373] hover:text-white transition-colors">Log In</Link>
                <Link href="/sign-up" className="block text-sm text-[#737373] hover:text-white transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#505050]">© 2025 VedaAI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-[#505050] hover:text-[#737373] transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-[#505050] hover:text-[#737373] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
