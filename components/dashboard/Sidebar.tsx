'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Target,
  Bell,
  BarChart3,
  FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Resumes', href: '/dashboard/resumes' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Target, label: 'Practice', href: '/interview/setup' },
  { icon: History, label: 'History', href: '/history' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-60 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-55 w-72 bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-white/5 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
              <Image 
                src="/images/logo.png" 
                alt="PrepMate Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              PrepMate
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${active 
                    ? 'bg-accent/10 text-accent shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-xl transition-colors
                    ${active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10'}
                  `}>
                    <item.icon size={18} />
                  </div>
                  <span className={`text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : ''}`}>
                    {item.label}
                  </span>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-bold">Sign Out</span>
          </button>

          {/* User Preview */}
          <div className="mt-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-accent flex items-center justify-center text-white font-bold text-sm">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">James Uchechi</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold truncate">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
