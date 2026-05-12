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
  BarChart2
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
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    bestScore: 0,
    streak: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [weakestArea, setWeakestArea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // 2. Fetch Sessions
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (sessions && sessions.length > 0) {
          const completedSessions = sessions.filter(s => s.completed);
          
          // Calculate Stats
          const totalScore = completedSessions.reduce((acc, s) => acc + (s.total_score || 0), 0);
          const avgScore = completedSessions.length > 0 ? Math.round(totalScore / completedSessions.length) : 0;
          const bestScore = completedSessions.length > 0 ? Math.max(...completedSessions.map(s => s.total_score || 0)) : 0;
          
          setStats({
            totalSessions: completedSessions.length,
            avgScore,
            bestScore: Math.round(bestScore),
            streak: profileData?.current_streak || 0
          });

          // Prepare Chart Data (Last 10 sessions)
          const trendData = completedSessions.slice(-10).map(s => ({
            date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: Math.round(s.total_score || 0)
          }));
          setChartData(trendData);

          // 3. Fetch Answers for Radar Chart
          const { data: answers } = await supabase
            .from('answers')
            .select('score_clarity, score_confidence, score_structure, score_relevance')
            .eq('user_id', user.id);

          if (answers && answers.length > 0) {
            const dims = [
              { subject: 'Clarity', A: 0, fullMark: 100 },
              { subject: 'Confidence', A: 0, fullMark: 100 },
              { subject: 'Structure', A: 0, fullMark: 100 },
              { subject: 'Relevance', A: 0, fullMark: 100 },
            ];

            dims[0].A = Math.round(answers.reduce((acc, a) => acc + (a.score_clarity || 0), 0) / answers.length);
            dims[1].A = Math.round(answers.reduce((acc, a) => acc + (a.score_confidence || 0), 0) / answers.length);
            dims[2].A = Math.round(answers.reduce((acc, a) => acc + (a.score_structure || 0), 0) / answers.length);
            dims[3].A = Math.round(answers.reduce((acc, a) => acc + (a.score_relevance || 0), 0) / answers.length);
            
            setRadarData(dims);

            // Find Weakest Area
            const sortedDims = [...dims].sort((a, b) => a.A - b.A);
            setWeakestArea(sortedDims[0]);
          }

          setRecentSessions(completedSessions.reverse().slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
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
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Sessions', val: stats.totalSessions, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Avg Score', val: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Best Score', val: `${stats.bestScore}%`, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Streak', val: `${stats.streak}d`, icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend */}
        <div className="p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <BarChart2 size={20} />
              </div>
              <h3 className="text-xl font-bold">Performance Trend</h3>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 10 Sessions</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0095F6" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#0095F6', strokeWidth: 0 }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension Breakdown */}
        <div className="p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Target size={20} />
              </div>
              <h3 className="text-xl font-bold">Skill Breakdown</h3>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate Average</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold">Recent Practice</h3>
            <Link href="/history" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <Link 
                  href={`/history/${session.id}`}
                  key={session.id} 
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-accent/50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{session.role}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(session.created_at).toLocaleDateString()} • {session.interview_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(session.total_score || 0)}%</p>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Score</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-accent transition-all" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-24 text-center rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                  <Plus size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No sessions yet</h3>
                <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto">Your journey to interview excellence starts with your first practice session.</p>
                <Link 
                  href="/interview/setup" 
                  className="px-10 py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold shadow-xl shadow-black/10"
                >
                  Start Your First Session
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold px-2">Coach's Corner</h3>
          
          {weakestArea ? (
            <div className="p-8 rounded-[40px] bg-linear-to-br from-indigo-600 via-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles size={24} className="text-blue-100" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Recommended Focus</p>
                  <h4 className="text-2xl font-black mt-1 leading-tight">Master {weakestArea.subject}</h4>
                </div>
                <p className="text-blue-100/90 text-sm leading-relaxed font-medium">
                  Your recent data shows <span className="text-white font-bold">{weakestArea.subject}</span> is your primary growth area. Improving this could boost your overall score by up to 15%.
                </p>
                <Link 
                  href="/interview/setup"
                  className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg"
                >
                  Focused Practice Session
                </Link>
              </div>
            </div>
          ) : (
             <div className="p-8 rounded-[40px] bg-slate-100 dark:bg-slate-800 text-slate-400 text-center border border-slate-200 dark:border-slate-700">
               <p className="text-sm font-medium">Complete a session to unlock AI insights.</p>
             </div>
          )}

          <div className="p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💡</div>
              <h4 className="font-bold text-slate-900 dark:text-white">Daily Tip</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic font-medium">
              "The STAR method (Situation, Task, Action, Result) is your best friend. Always quantify your results to stand out to hiring managers."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
