'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LayoutGrid,
  Bell,
  ChevronDown,
} from 'lucide-react';

export default function TopBar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between bg-white border-b border-[#E5E7EB] px-4 md:px-6 h-14 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <LayoutGrid className="w-4 h-4 text-[#9CA3AF]" />
        <span className="text-sm text-[#9CA3AF] font-medium">Assignment</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E8612D] rounded-full" />
        </button>

        {/* User avatar & name */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=john"
              alt="John Doe"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden md:inline text-sm font-medium text-[#1A1A1A]">
            John Doe
          </span>
          <ChevronDown className="w-4 h-4 text-[#6B7280] hidden md:block" />
        </div>
      </div>
    </header>
  );
}
