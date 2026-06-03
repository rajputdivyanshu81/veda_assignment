'use client';

import { useState, useEffect } from 'react';
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
  { label: 'Assignments', href: '/', icon: ClipboardList },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: MonitorPlay },
  { label: 'My Library', href: '/library', icon: Bookmark },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState({
    schoolName: '',
    schoolCity: '',
    userInitials: 'N',
    schoolPic: '',
    profilePic: ''
  });
  const [counts, setCounts] = useState<{ assignments: number; library: number }>({
    assignments: 0,
    library: 0
  });
  const [lastSeen, setLastSeen] = useState<{ assignments: number; library: number }>({
    assignments: 0,
    library: 0
  });

  useEffect(() => {
    const loadProfileData = () => {
      setProfileData({
        schoolName: localStorage.getItem('vedaai_school_name') || '',
        schoolCity: localStorage.getItem('vedaai_school_city') || '',
        userInitials: localStorage.getItem('vedaai_user_initials') || 'N',
        schoolPic: localStorage.getItem('vedaai_school_pic') || '',
        profilePic: localStorage.getItem('vedaai_profile_pic') || ''
      });
    };

    const fetchCounts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.assignments || [];
          const completed = items.filter((a: any) => a.status === 'completed').length;
          
          setCounts({
            assignments: items.length,
            library: completed
          });

          // Auto-mark seen if currently on the page during fetch
          if (pathname === '/') {
            localStorage.setItem('vedaai_last_seen_assignments', items.length.toString());
            setLastSeen(prev => ({ ...prev, assignments: items.length }));
          }
          if (pathname === '/library') {
            localStorage.setItem('vedaai_last_seen_library', completed.toString());
            setLastSeen(prev => ({ ...prev, library: completed }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    // Load last seen count cache
    setLastSeen({
      assignments: parseInt(localStorage.getItem('vedaai_last_seen_assignments') || '0', 10),
      library: parseInt(localStorage.getItem('vedaai_last_seen_library') || '0', 10)
    });
    
    loadProfileData();
    fetchCounts();
    window.addEventListener('settings-updated', loadProfileData);
    window.addEventListener('assignments-changed', fetchCounts);
    return () => {
      window.removeEventListener('settings-updated', loadProfileData);
      window.removeEventListener('assignments-changed', fetchCounts);
    };
  }, [pathname]);

  // Handle path transitions to clear seen states
  useEffect(() => {
    if (counts.assignments > 0 && pathname === '/') {
      localStorage.setItem('vedaai_last_seen_assignments', counts.assignments.toString());
      setLastSeen(prev => ({ ...prev, assignments: counts.assignments }));
    }
    if (counts.library > 0 && pathname === '/library') {
      localStorage.setItem('vedaai_last_seen_library', counts.library.toString());
      setLastSeen(prev => ({ ...prev, library: counts.library }));
    }
  }, [pathname, counts]);

  return (
    <aside className="hidden lg:flex flex-col w-[230px] min-h-screen bg-white border-r border-[#E5E7EB] px-4 py-5 justify-between shrink-0">
      {/* Top section */}
      <div>
        {/* VedaAI Logo */}
        <div className="flex items-center gap-2 px-2 mb-5">
          <img src="/logo.png" alt="VedaAI Logo" className="w-8 h-8 object-contain rounded-lg" />
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
            
            const totalCount = 
              item.label === 'Assignments' ? counts.assignments :
              item.label === 'My Library' ? counts.library : 0;

            const seenCount = 
              item.label === 'Assignments' ? lastSeen.assignments :
              item.label === 'My Library' ? lastSeen.library : 0;

            // Only show unread badge delta, ignore if active page
            const badgeValue = isActive ? 0 : Math.max(0, totalCount - seenCount);

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
                {badgeValue > 0 && (
                  <span className="bg-[#E8612D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {badgeValue}
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors mb-4"
        >
          <Settings className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[15px]">Settings</span>
        </Link>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] my-4" />

        {/* School & User Profile */}
        <div className="flex items-center gap-3 px-2 py-2 mt-2">
          {/* Overlapping Avatars */}
          <div className="relative w-[42px] h-[42px] shrink-0">
            {/* Background School Avatar (Orange/Blue) */}
            <div className="absolute top-0 right-0 w-9 h-9 rounded-full bg-[#FF9800] overflow-hidden flex items-center justify-center">
              <img
                src={profileData.schoolPic || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=FF9800"}
                alt="School"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Foreground User Avatar (Dark 'N') */}
            <div className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-[#242424] border-[1.5px] border-white flex items-center justify-center shadow-sm overflow-hidden z-10">
               {profileData.profilePic ? (
                 <img src={profileData.profilePic} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-white text-[11px] font-medium tracking-wide">
                   {profileData.userInitials}
                 </span>
               )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-[14px] font-semibold text-[#1A1A1A] truncate leading-tight tracking-tight mb-0.5">
              {profileData.schoolName || 'Edit School Name'}
            </p>
            <p className="text-[13px] text-[#6B7280] truncate leading-tight">
              {profileData.schoolCity || 'Edit School City'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
