'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Play, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Plus,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    streak: 0
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // Fetch Recent Sessions
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentSessions(sessions || []);

        // Mock stats for now (until we have real data aggregation)
        setStats({
          totalSessions: sessions?.length || 0,
          avgScore: 78, // Placeholder
          streak: 3 // Placeholder
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            Ready to crush your {profile?.target_role || 'next'} interview?
          </p>
        </div>
        <Link 
          href="/interview" 
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all"
        >
          <Play size={18} fill="currentColor" />
          Start Practice Session
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <Clock size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Sessions</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalSessions}</h3>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Score</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.avgScore}%</h3>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
            <Award size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Streak</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.streak} Days</h3>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Sessions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <Link href="/history" className="text-sm font-bold text-accent hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-accent/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                        {session.role} Interview
                      </h4>
                      <p className="text-xs text-slate-500">
                        {new Date(session.created_at).toLocaleDateString()} • {session.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{session.score || '--'}%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Score</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-accent transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">No sessions yet</h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">Your interview journey starts here.</p>
                <Link 
                  href="/interview" 
                  className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-black text-white rounded-lg font-bold text-sm"
                >
                  Start First Session
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Coach Insights</h2>
          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles size={20} className="text-blue-100" />
              </div>
              <h4 className="font-bold">Next Recommended Focus</h4>
            </div>
            <h3 className="text-2xl font-bold mb-4 leading-tight">Master the STAR Framework</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 opacity-90">
              Based on your last session, you excel at explaining 'Actions' but could provide more clarity on 'Results'.
            </p>
            <button className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-50 transition-all">
              Watch Quick Guide
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Daily Interview Tip</h4>
            <div className="flex gap-4">
              <div className="text-2xl">💡</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "When asked about a weakness, focus on a real skill you're actively improving. Don't use a fake weakness like 'being a perfectionist'."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
