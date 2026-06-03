'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  ClipboardList,
  Bookmark,
  Monitor,
  Plus,
} from 'lucide-react';

interface MobileTab {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const tabs: MobileTab[] = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: <LayoutGrid size={22} />,
  },
  {
    label: 'Assignments',
    href: '/',
    icon: <ClipboardList size={22} />,
  },
  {
    label: 'Library',
    href: '/library',
    icon: <Bookmark size={22} />,
  },
  {
    label: 'AI Toolkit',
    href: '/toolkit',
    icon: <Monitor size={22} />,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
      {/* Floating Action Button */}
      <div className="pointer-events-none flex justify-end px-4 pb-2">
        <button
          onClick={() => router.push('/create')}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8612D] text-white shadow-lg shadow-[#E8612D]/30 transition-transform hover:scale-105 active:scale-95"
          aria-label="Create Assignment"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="rounded-t-2xl bg-[#2A2A2A] px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === '/dashboard' && pathname === '/dashboard');
            
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-3"
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-b-full bg-[#E8612D]" />
                )}

                {/* Icon */}
                <span
                  className={`transition-colors ${
                    isActive
                      ? 'text-[#E8612D]'
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                </span>

                {/* Label */}
                <span
                  className={`text-[10px] leading-tight transition-colors ${
                    isActive
                      ? 'font-semibold text-[#E8612D]'
                      : 'font-normal text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
