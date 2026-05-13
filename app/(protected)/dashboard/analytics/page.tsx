'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  Award,
  Calendar,
  Filter,
  Download,
  Info,
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('30d');
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('sessions')
        .select(`
          *,
          answers (*)
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: true });

      setSessions(data || []);
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

  // Analytics Logic
  const allAnswers = sessions.flatMap(s => s.answers || []);
  const getAvg = (key: string) => {
    if (allAnswers.length === 0) return 0;
    return Math.round(allAnswers.reduce((acc, a) => acc + (a[key] || 0), 0) / allAnswers.length);
  };

  const radarData = [
    { subject: 'Clarity', A: getAvg('score_clarity'), fullMark: 100 },
    { subject: 'Structure', A: getAvg('score_structure'), fullMark: 100 },
    { subject: 'Confidence', A: getAvg('score_confidence'), fullMark: 100 },
    { subject: 'Relevance', A: getAvg('score_relevance'), fullMark: 100 },
  ];

  const typeData = [
    { name: 'Behavioral', value: sessions.filter(s => s.interview_type === 'behavioral').length },
    { name: 'Technical', value: sessions.filter(s => s.interview_type === 'technical').length },
    { name: 'Cultural', value: sessions.filter(s => s.interview_type === 'cultural').length },
  ].filter(t => t.value > 0);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  // Readiness calculation logic
  const avgScore = sessions.length > 0 
    ? sessions.reduce((acc, s) => acc + (s.total_score || 0), 0) / sessions.length 
    : 0;
  const readiness = Math.min(Math.round((avgScore * 0.7) + (sessions.length * 2)), 100);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Performance Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Deep insights into your interview journey and readiness.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          {['7d', '30d', 'All'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                timeframe === t 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top Insights Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Meter */}
        <div className="lg:col-span-1 p-10 bg-slate-900 text-white rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Interview Readiness</span>
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={552}
                  strokeDashoffset={552 - (552 * readiness) / 100}
                  className="text-blue-500 transition-all duration-1000 ease-out stroke-round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{readiness}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Ready</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">
              Based on your recent <span className="text-white font-bold">{sessions.length} sessions</span>, you're looking {readiness > 80 ? 'extremely' : 'fairly'} prepared.
            </p>
          </div>
        </div>

        {/* Growth Trend */}
        <div className="lg:col-span-2 p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[48px] shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Score Trajectory</h3>
                <p className="text-sm text-slate-500">Your average score across sessions.</p>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessions}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888811" />
                <XAxis dataKey="created_at" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '16px', border: 'none' }}
                  labelFormatter={(v) => new Date(v).toLocaleDateString()}
                />
                <Area type="monotone" dataKey="total_score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Breakdown Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Skill Matrix */}
        <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[48px] shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit size={20} className="text-purple-500" /> Skill Matrix
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#88888811" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888888', fontWeight: 'bold' }} />
                <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension Comparison */}
        <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[48px] shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter size={20} className="text-blue-500" /> Session Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4">
            {typeData.map((t, i) => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Plan */}
        <div className="p-10 bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} /> AI Action Plan
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Primary Goal</p>
              <p className="text-sm font-bold">Improve Structure by 15%</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                <p className="text-sm text-blue-100 font-medium">Use the <span className="text-white font-bold">STAR method</span> for all behavioral answers.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                <p className="text-sm text-blue-100 font-medium">Reduce filler words to boost <span className="text-white font-bold">Confidence</span>.</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
              Start Targeted Session
            </button>
          </div>
        </div>
      </motion.div>

      {/* History Grid Preview */}
      <motion.div variants={itemVariants} className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[48px] shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Sessions</h3>
          <Link href="/history" className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-1 hover:underline">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.slice(-3).reverse().map((session) => (
            <div key={session.id} className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-accent/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(session.total_score)}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overall</p>
                </div>
              </div>
              <p className="font-bold text-slate-900 dark:text-white truncate">{session.role}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{session.interview_type}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
