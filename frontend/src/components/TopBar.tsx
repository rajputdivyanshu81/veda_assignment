import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  LayoutGrid,
  Bell,
  Menu,
  X,
  Home,
  Users,
  ClipboardList,
  MonitorPlay,
  Bookmark,
  Settings,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'My Groups', href: '/groups', icon: Users },
  { label: 'My Library', href: '/library', icon: Bookmark },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: MonitorPlay },
];

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    schoolName: 'Delhi Public School',
    schoolCity: 'Bokaro Steel City',
    schoolPic: '',
  });

  const [counts, setCounts] = useState<{ assignments: number; library: number }>({
    assignments: 0,
    library: 0,
  });
  const [lastSeen, setLastSeen] = useState<{ assignments: number; library: number }>({
    assignments: 0,
    library: 0,
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadProfileData = () => {
      setProfileData({
        schoolName: localStorage.getItem('vedaai_school_name') || 'Delhi Public School',
        schoolCity: localStorage.getItem('vedaai_school_city') || 'Bokaro Steel City',
        schoolPic: localStorage.getItem('vedaai_school_pic') || '',
      });
    };
    
    loadProfileData();
    window.addEventListener('settings-updated', loadProfileData);
    return () => window.removeEventListener('settings-updated', loadProfileData);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('vedaai_token') : null;
      try {
        const res = await fetch(`${API_URL}/api/assignments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.assignments || [];
          const completed = items.filter((a: any) => a.status === 'completed').length;
          
          setCounts({
            assignments: items.length,
            library: completed,
          });
        }
      } catch (err) {
        console.error('Failed to fetch counts in TopBar:', err);
      }
    };

    const loadLastSeen = () => {
      setLastSeen({
        assignments: parseInt(localStorage.getItem('vedaai_last_seen_assignments') || '0', 10),
        library: parseInt(localStorage.getItem('vedaai_last_seen_library') || '0', 10),
      });
    };

    loadLastSeen();
    fetchCounts();
    
    window.addEventListener('assignments-changed', fetchCounts);
    return () => {
      window.removeEventListener('assignments-changed', fetchCounts);
    };
  }, [pathname, API_URL]);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAssignments = pathname === '/' ? 0 : Math.max(0, counts.assignments - lastSeen.assignments);
  const unreadLibrary = pathname === '/library' ? 0 : Math.max(0, counts.library - lastSeen.library);
  const hasUnread = unreadAssignments > 0 || unreadLibrary > 0;

  const markAllAsRead = () => {
    localStorage.setItem('vedaai_last_seen_assignments', counts.assignments.toString());
    localStorage.setItem('vedaai_last_seen_library', counts.library.toString());
    setLastSeen({
      assignments: counts.assignments,
      library: counts.library,
    });
    setIsNotificationsOpen(false);
  };

  return (
    <>
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
        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-1.5 rounded-lg hover:bg-gray-50 text-[#6B7280] hover:text-[#1A1A1A] transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E8612D] border-2 border-white rounded-full animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Notifications</span>
                  {hasUnread && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-[#E8612D] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto px-4 py-2 space-y-2">
                  {!hasUnread ? (
                    <p className="text-xs text-gray-500 text-center py-4">All caught up! No new notifications.</p>
                  ) : (
                    <>
                      {unreadAssignments > 0 && (
                        <div className="flex flex-col gap-0.5 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <p className="font-semibold text-gray-900">New Assignments</p>
                          <p className="text-[11px] text-gray-500">You have {unreadAssignments} new assignment{unreadAssignments > 1 ? 's' : ''} to grade.</p>
                          <Link
                            href="/"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-[10px] text-[#E8612D] font-semibold mt-1 hover:underline"
                          >
                            View assignments &rarr;
                          </Link>
                        </div>
                      )}
                      {unreadLibrary > 0 && (
                        <div className="flex flex-col gap-0.5 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <p className="font-semibold text-gray-900">New Library Items</p>
                          <p className="text-[11px] text-gray-500">{unreadLibrary} completed question paper{unreadLibrary > 1 ? 's are' : ' is'} ready in your library.</p>
                          <Link
                            href="/library"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-[10px] text-[#E8612D] font-semibold mt-1 hover:underline"
                          >
                            Go to Library &rarr;
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User avatar & name */}
          <div className="flex items-center">
            <UserButton />
          </div>

          {/* Hamburger Menu Toggle (visible on mobile only) */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-[#1A1A1A] p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col justify-between p-5 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="VedaAI Logo" className="w-8 h-8 object-contain rounded-lg" />
                  <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">VedaAI</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-[#E8612D] bg-[#E8612D]/5 font-bold'
                          : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Footer */}
            <div className="border-t border-gray-100 pt-5">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors mb-4 ${
                  pathname === '/settings'
                    ? 'text-[#E8612D] bg-[#E8612D]/5 font-bold'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              {/* School Details */}
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-[#FF9800] overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={profileData.schoolPic || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=FF9800"}
                    alt="School"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1A1A1A] truncate leading-tight">{profileData.schoolName}</p>
                  <p className="text-[10px] text-gray-500 truncate leading-none mt-1">{profileData.schoolCity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
