'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  LayoutGrid,
  Bell,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function TopBar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between bg-white border-b border-[#E5E7EB] px-4 md:px-6 h-14 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo Link (visible on mobile only) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <img src="/logo.png" alt="VedaAI Logo" className="w-7 h-7 object-contain rounded-lg" />
          <span className="text-base font-bold text-[#1A1A1A] tracking-tight">VedaAI</span>
        </Link>

        {/* Desktop Breadcrumbs (visible on desktop only) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LayoutGrid className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-sm text-[#9CA3AF] font-medium">Assignment</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E8612D] rounded-full" />
        </button>

        {/* User avatar & name */}
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
