'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Moon, 
  Sun,
  LayoutGrid
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUser(data);
      }
    }
    getUser();
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function getNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);
        setUnreadCount(count || 0);
      }
    }
    getNotifications();
  }, []);

  if (!mounted) return (
    <header className="h-20 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl z-40">
      <div className="flex-1" />
    </header>
  );

  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl z-40">
      {/* Search - Hidden on small mobile */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your history..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm"
          />
        </div>
      </div>

      {/* Spacing for mobile menu button which sits on the left */}
      <div className="md:hidden w-12" />

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setTheme('light')}
            className={`p-2 transition-all rounded-xl ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Sun size={18} />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`p-2 transition-all rounded-xl ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Moon size={18} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <Link href="/dashboard/notifications" className="relative p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 group transition-all">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#050505]" />
          )}
        </Link>

        <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-slate-200 dark:border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[120px]">
              {user?.full_name || 'Loading...'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
              {user?.target_role || 'Candidate'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-white font-black text-sm shadow-lg shadow-accent/20 cursor-pointer hover:scale-105 transition-all overflow-hidden relative">
            {user?.avatar_url ? (
              <Image 
                src={user.avatar_url} 
                alt={user.full_name || 'User'} 
                fill 
                className="object-cover"
              />
            ) : (
              <span>{user?.full_name?.[0] || 'U'}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
