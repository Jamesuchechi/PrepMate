'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut,
  Target,
  Sparkles,
  User
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Practice', icon: MessageSquare, href: '/interview' },
  { name: 'History', icon: History, href: '/history' },
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-900 flex flex-col sticky top-0">
      {/* Brand */}
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <Image 
              src="/images/logo.png" 
              alt="PrepMate Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Prep<span className="text-accent">Mate</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-accent' : 'group-hover:text-white'} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Upgrade Card */}
      <div className="mx-4 mb-6 p-4 rounded-2xl bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-accent">
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Pro Access</span>
        </div>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Unlock brutally honest AI feedback and unlimited sessions.
        </p>
        <button className="w-full py-2 bg-accent text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all">
          Upgrade Now
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pb-8 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
