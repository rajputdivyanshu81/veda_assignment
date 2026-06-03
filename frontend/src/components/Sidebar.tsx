'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ClipboardList,
  MonitorPlay,
  Bookmark,
  Settings,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'My Groups', href: '/groups', icon: Users },
  { label: 'Assignments', href: '/', icon: ClipboardList, badge: 10 },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: MonitorPlay },
  { label: 'My Library', href: '/library', icon: Bookmark, badge: 32 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[230px] min-h-screen bg-white border-r border-[#E5E7EB] px-4 py-5 justify-between shrink-0">
      {/* Top section */}
      <div>
        {/* VedaAI Logo */}
        <div className="flex items-center gap-2 px-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#E8612D] flex items-center justify-center">
            <span className="text-white font-extrabold text-base leading-none">V</span>
          </div>
          <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">VedaAI</span>
        </div>

        {/* Create Assignment Button */}
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full bg-[#1A1A1A] text-white rounded-full py-2.5 px-4 text-sm font-medium mb-6 hover:bg-[#333] transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#E8612D]" />
          Create Assignment
        </Link>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'font-semibold text-[#1A1A1A] bg-[#F3F3F3]'
                    : 'font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB]'
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#E8612D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div>
        {/* Settings */}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors mb-3"
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </Link>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] my-3" />

        {/* School Profile */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=school"
              alt="School"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1A1A1A] truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-[11px] text-[#6B7280] truncate leading-tight">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
