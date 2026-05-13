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
  MessageSquare,
  Target,
  Zap,
  BarChart2,
  BarChart3,
  History,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis 
} from 'recharts';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ReadinessCertificate from '@/components/ReadinessCertificate';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const { data: sessionData } = await supabase
        .from('sessions')
        .select(`
          *,
          answers (*)
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: true });

      setProfile(profileData);
      setSessions(sessionData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate Stats
  const stats = {
    totalSessions: sessions.length,
    avgScore: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.total_score || 0), 0) / sessions.length) 
      : 0,
    bestScore: sessions.length > 0 
      ? Math.max(...sessions.map(s => s.total_score || 0)) 
      : 0,
    streak: profile?.current_streak || 0
  };

  // Calculate Real Dimension Averages
  const allAnswers = sessions.flatMap(s => s.answers || []);
  const getAvg = (key: string) => {
    if (allAnswers.length === 0) return 0;
    const sum = allAnswers.reduce((acc, a) => acc + (a[key] || 0), 0);
    return Math.round(sum / allAnswers.length);
  };

  const radarData = [
    { subject: 'Clarity', A: getAvg('score_clarity'), fullMark: 100 },
    { subject: 'Structure', A: getAvg('score_structure'), fullMark: 100 },
    { subject: 'Confidence', A: getAvg('score_confidence'), fullMark: 100 },
    { subject: 'Relevance', A: getAvg('score_relevance'), fullMark: 100 },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
            You're currently on a <span className="text-orange-500 font-bold">{stats.streak} day streak</span>. Keep it going!
          </p>
        </div>
        <Link 
          href="/interview/setup" 
          className="flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Play size={20} fill="currentColor" />
          Start New Practice
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Streak', value: `${stats.streak} Days`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Avg Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Sessions', value: stats.totalSessions, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Best Score', value: `${stats.bestScore}%`, icon: BarChart3, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:scale-[1.02] transition-all shadow-sm">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Certificate Section (Conditional) */}
      {stats.avgScore >= 90 && stats.totalSessions >= 5 && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="text-accent" size={24} />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your Elite Achievement</h2>
          </div>
          <ReadinessCertificate 
            userName={profile?.full_name || 'Candidate'}
            role={profile?.target_role || 'Software Engineer'}
            averageScore={stats.avgScore}
            totalSessions={stats.totalSessions}
            date={new Date().toLocaleDateString()}
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Trend */}
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} /> Performance Trend
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessions}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                  <XAxis dataKey="created_at" tickFormatter={(v) => new Date(v).toLocaleDateString()} hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff11', borderRadius: '16px' }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="total_score" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Radar */}
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm">
              <h3 className="text-lg font-bold mb-6">Skill Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#88888822" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888888' }} />
                    <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coach's Corner */}
            <div className="p-8 bg-blue-600 text-white rounded-[40px] shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform"></div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lightbulb size={20} /> Coach's Corner
              </h3>
              <div className="space-y-4 relative z-10">
                <p className="text-sm font-medium leading-relaxed">
                  "Keep using the STAR method. Your clarity has improved by 12% this week. Ready to beat your best score of {stats.bestScore}%?"
                </p>
                <Link href="/interview/setup" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-blue-600 px-4 py-2 rounded-xl">
                  Try Practice <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          {/* Quick Action */}
          <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-transparent"></div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Ready to Level Up?</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">Launch a new session and beat your record of {profile?.longest_streak || 0} days.</p>
            <Link href="/interview/setup" className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all relative z-10">
              Start New Practice <Plus size={18} />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm">
            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {sessions.length > 0 ? (
                sessions.slice(-3).reverse().map((session) => (
                  <Link href={`/history/${session.id}`} key={session.id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
                      <History size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{session.role}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{new Date(session.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{Math.round(session.total_score)}%</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs font-bold uppercase">No sessions yet</p>
                </div>
              )}
            </div>
            <Link href="/history" className="block w-full mt-6 py-3 text-center text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              View All History
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
