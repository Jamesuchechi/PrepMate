'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Play, 
  ChevronRight,
  Target,
  Shield,
  Zap,
  User,
  AlertCircle
} from 'lucide-react';

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "Customer Success"
];

const COACHES = [
  {
    id: 'mentor',
    name: 'The Mentor',
    description: 'Encouraging and growth-oriented. Perfect for building confidence.',
    icon: GraduationCap,
    color: 'bg-green-500/10 text-green-500'
  },
  {
    id: 'drill_sergeant',
    name: 'The Drill Sergeant',
    description: 'Strict and high-pressure. Focuses on speed and precision.',
    icon: Shield,
    color: 'bg-red-500/10 text-red-500'
  },
  {
    id: 'tech_lead',
    name: 'The Tech Lead',
    description: 'Detail-oriented and deep-diving. Focuses on technical mastery.',
    icon: Zap,
    color: 'bg-blue-500/10 text-blue-500'
  }
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState(ROLES[0]);
  const [experience, setExperience] = useState('entry');
  const [type, setType] = useState('behavioral');
  const [count, setCount] = useState(5);
  const [coach, setCoach] = useState('mentor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          role: role,
          experience_level: experience,
          interview_type: type,
          question_count: count,
          coach_personality: coach,
          completed: false,
          total_score: 0
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      router.push(`/interview/session/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Setup Your Session</h1>
        <p className="text-slate-500 text-lg font-medium">Customize your practice experience for maximum growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400">Target Role</label>
            <div className="grid grid-cols-1 gap-2">
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl outline-none focus:border-accent transition-all text-slate-700 dark:text-slate-200 font-bold"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Level & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400">Experience</label>
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {['entry', 'mid', 'senior'].map(l => (
                  <button
                    key={l}
                    onClick={() => setExperience(l)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${experience === l ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400">Type</label>
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {['behavioral', 'technical'].map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${type === t ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400">Question Count</label>
              <span className="text-sm font-black text-accent">{count} Questions</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="10" 
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Coach Selection */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400">Choose Your Coach</label>
            <div className="space-y-3">
              {COACHES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCoach(c.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-4 text-left group ${coach === c.id ? 'border-accent bg-accent/5' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-white/10'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${c.color}`}>
                    <c.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className={`font-bold transition-colors ${coach === c.id ? 'text-accent' : 'text-slate-900 dark:text-white'}`}>{c.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        <button
          onClick={handleStart}
          disabled={loading}
          className="group relative px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-3xl text-lg uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" size={20} />}
            {loading ? 'Preparing...' : 'Start Session'}
            {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </span>
        </button>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          Estimated duration: {count * 3} mins
        </p>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
