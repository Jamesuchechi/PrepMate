'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Code, 
  UserCheck, 
  ArrowRight, 
  Clock, 
  Target,
  Settings2,
  Briefcase,
  Zap,
  Sparkles,
  Code2
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewSetupPage() {
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [selectedType, setSelectedType] = useState('behavioral');
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [questionCount, setQuestionCount] = useState(5);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data);
          setRole(data.target_role || '');
          setExperienceLevel(data.experience_level || 'mid');
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          interview_type: selectedType,
          role: role,
          experience_level: experienceLevel,
          question_count: questionCount,
          completed: false,
          total_score: 0
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/interview/session/${session.id}`);
    } catch (err) {
      console.error(err);
      setStarting(false);
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
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20 animate-fade-in">
          <Sparkles size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Setup Phase</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Configure Your <span className="text-blue-600">Session</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
          Customize your AI-powered interview to focus on what matters most for your career.
        </p>
      </div>

      {/* Interview Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { id: 'behavioral', title: 'Behavioral', desc: 'STAR method, soft skills, and past experiences.', icon: Users },
          { id: 'technical', title: 'Technical', desc: 'Core concepts, problem-solving, and role-specific skills.', icon: Code2 },
          { id: 'cultural', title: 'HR / Cultural', desc: 'Culture fit, expectations, and values alignment.', icon: UserCheck },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`p-8 rounded-[40px] text-left transition-all duration-500 relative overflow-hidden group border-2 ${
              type.id === selectedType 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-2xl scale-[1.02]' 
                : 'bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border-slate-100 dark:border-white/5 hover:border-blue-500/30'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              type.id === selectedType ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-600'
            }`}>
              <type.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{type.title}</h3>
            <p className={`text-sm leading-relaxed ${type.id === selectedType ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>
              {type.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Configuration Panel */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[48px] p-10 md:p-14 shadow-2xl space-y-12 relative overflow-hidden">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Target Role */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <Briefcase size={16} /> Target Role
            </label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 dark:text-white"
              placeholder="e.g. Software Engineer"
            />
          </div>

          {/* Session Length */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <Clock size={16} /> Session Length
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                    questionCount === num 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500/30'
                  }`}
                >
                  <span className="text-xl block">{num}</span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-60">Questions</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-4 relative z-10">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
            <Zap size={16} /> Experience Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['entry', 'mid', 'senior'].map((level) => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all border-2 ${
                  experienceLevel === level 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-6 relative z-10">
          <button
            onClick={handleStart}
            disabled={starting || !role.trim()}
            className="w-full py-6 bg-blue-600 text-white text-xl font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50 disabled:grayscale group"
          >
            {starting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            ) : (
              <>
                Launch Interview <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="flex justify-center gap-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Model: Mistral & Groq</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">STAR Methodology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Real-time Feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
