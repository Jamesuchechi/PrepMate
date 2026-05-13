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
  Award,
  FileText,
  Flame,
  Loader2,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileReadonlyPage() {
  const [loading, setLoading] = useState(true);
  const [roasting, setRoasting] = useState(false);
  const [roastResult, setRoastResult] = useState<string | null>(null);
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

  const handleRoastResume = async () => {
    if (!profile?.resume_data || roasting) return;
    
    setRoasting(true);
    try {
      const response = await fetch('/api/roast-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: profile.resume_data,
          role: profile.target_role
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRoastResult(data.roast);
    } catch (err) {
      console.error(err);
    } finally {
      setRoasting(false);
    }
  };

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

          {/* Resume & Personalization */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resume & Experience</h3>
                  <p className="text-sm text-slate-500">Upload your resume to tailor interviews to your background.</p>
                </div>
              </div>
              {profile?.resume_url && (
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  Analyzed
                </div>
              )}
            </div>

            {profile?.resume_url ? (
              <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px]">Current Resume</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last updated {new Date(profile.updated_at || profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/dashboard/profile/edit"
                      className="text-xs font-black uppercase tracking-widest text-accent hover:underline"
                    >
                      Update
                    </Link>
                    <span className="text-slate-700">•</span>
                    <button 
                      onClick={handleRoastResume}
                      disabled={roasting}
                      className="text-xs font-black uppercase tracking-widest text-orange-500 hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      {roasting ? <Loader2 size={12} className="animate-spin" /> : '🔥 Roast'}
                    </button>
                  </div>
                </div>

                {roastResult && (
                  <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 relative animate-in zoom-in duration-300">
                    <button 
                      onClick={() => setRoastResult(null)}
                      className="absolute top-4 right-4 text-orange-500/50 hover:text-orange-500"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-2 text-orange-500 mb-4">
                      <Flame size={18} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-widest">The Resume Roast</span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-orange-900/80 dark:text-orange-100/70 whitespace-pre-wrap italic">
                      {roastResult}
                    </div>
                  </div>
                )}

                {profile.resume_data?.skills && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Extracted Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.resume_data.skills.slice(0, 8).map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-100 dark:border-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] space-y-4">
                <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
                  Upload your resume to enable <span className="text-slate-900 dark:text-white font-bold">Personalized Questioning</span> based on your actual work history.
                </p>
                <Link 
                  href="/dashboard/profile/edit"
                  className="inline-flex px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
                >
                  Upload Resume
                </Link>
              </div>
            )}
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
