'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  User, 
  Settings, 
  Mail, 
  Trophy, 
  Calendar,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Edit3,
  Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileReadonlyPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({
    avgScore: 0,
    totalSessions: 0,
    completedFirst: false,
    streakProgress: 0
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);

        // Fetch Sessions for Stats
        const { data: sessions } = await supabase
          .from('sessions')
          .select('total_score, completed')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (sessions && sessions.length > 0) {
          const total = sessions.reduce((acc, s) => acc + (s.total_score || 0), 0);
          setStats({
            avgScore: Math.round(total / sessions.length),
            totalSessions: sessions.length,
            completedFirst: true,
            streakProgress: Math.min(((profileData?.current_streak || 0) / 7) * 100, 100)
          });
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Cover/Header Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="h-32 bg-linear-to-r from-accent/20 via-blue-500/10 to-indigo-500/20"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden relative shadow-xl">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            )}
          </div>
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile?.full_name || 'New Candidate'}
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Briefcase size={16} /> {profile?.target_role || 'Candidate'}
            </p>
          </div>
          <Link 
            href="/dashboard/profile/edit"
            className="mb-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <Edit3 size={18} />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-slate-900 dark:text-white font-medium">{email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience Level</p>
                <p className="text-slate-900 dark:text-white font-medium capitalize">{profile?.experience_level || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
                <p className="text-slate-900 dark:text-white font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Loading...'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sessions Completed</p>
                <p className="text-slate-900 dark:text-white font-medium">{stats.totalSessions}</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Achievements</h3>
              <Trophy className="text-yellow-500" size={20} />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                stats.completedFirst 
                  ? 'bg-blue-500/5 border-blue-500/20 text-blue-600' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.completedFirst ? 'bg-blue-500/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">First Session</p>
                  <p className="text-[10px] uppercase font-bold">{stats.completedFirst ? 'Completed' : 'Locked'}</p>
                </div>
              </div>
              
              <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                profile?.current_streak >= 7
                  ? 'bg-orange-500/5 border-orange-500/20 text-orange-600' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.current_streak >= 7 ? 'bg-orange-500/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">7 Day Streak</p>
                  <p className="text-[10px] uppercase font-bold">{profile?.current_streak >= 7 ? 'Achieved' : 'In Progress'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-accent" size={20} />
              Statistics
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400 mb-2">
                  <span>Current Streak</span>
                  <span className="text-white">{profile?.current_streak || 0} / 7 Days</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000" 
                    style={{ width: `${stats.streakProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold">{profile?.longest_streak || 0}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Best Streak</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold">{stats.avgScore}%</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Membership</h3>
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Free Plan</p>
                <p className="text-xs text-slate-500">Standard Access</p>
              </div>
              <ChevronRight className="text-accent" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
