'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Bell, Search, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Topbar() {
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({ ...profile, full_name: user.email?.split('@')[0] }); // Immediate fallback
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    }
    getProfile();

    // Refresh when window is focused (e.g. after coming back from edit page)
    window.addEventListener('focus', getProfile);
    return () => window.removeEventListener('focus', getProfile);
  }, []);

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search sessions, tips, or questions..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>

        <Link href="/dashboard/profile" className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {profile?.target_role || 'Candidate'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
            ) : (
              <User size={20} className="text-slate-500" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
