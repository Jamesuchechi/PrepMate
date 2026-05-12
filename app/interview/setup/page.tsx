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
  Settings2
} from 'lucide-react';

const INTERVIEW_TYPES = [
  {
    id: 'behavioral',
    title: 'Behavioral',
    description: 'STAR method, soft skills, and past experiences.',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    id: 'technical',
    title: 'Technical',
    description: 'Core concepts, problem-solving, and role-specific skills.',
    icon: Code,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    id: 'hr',
    title: 'HR / Cultural',
    description: 'Culture fit, expectations, and values alignment.',
    icon: UserCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  }
];

const QUESTION_COUNTS = [5, 10, 15];

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
          setExperienceLevel(data.experience_level || 'entry');
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          interview_type: selectedType,
          role: role,
          experience_level: experienceLevel,
          question_count: questionCount,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/interview/session/${data.id}`);
    } catch (err: any) {
      alert(err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-white to-slate-500">
            Configure Your Session
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Customize your AI-powered interview to focus on what matters most for your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INTERVIEW_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group ${
                selectedType === type.id 
                  ? `${type.border} bg-[#0A0A0A] shadow-2xl shadow-white/5 scale-[1.02]` 
                  : 'border-white/5 bg-transparent hover:border-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl ${type.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <type.icon className={type.color} size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{type.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {type.description}
              </p>
              {selectedType === type.id && (
                <div className="absolute top-4 right-4">
                  <div className={`w-2 h-2 rounded-full ${type.color.replace('text-', 'bg-')} animate-pulse`} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <Target size={16} /> Target Role
                </label>
                <input 
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus:border-blue-500 outline-none transition-all text-lg"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <Settings2 size={16} /> Experience Level
                </label>
                <div className="flex gap-2">
                  {['entry', 'mid', 'senior'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-tighter transition-all ${
                        experienceLevel === level
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-slate-500 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={16} /> Session Length
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {QUESTION_COUNTS.map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`py-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                        questionCount === count
                          ? 'border-blue-500 bg-blue-500/5 text-white'
                          : 'border-white/5 bg-black/50 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      <span className="text-2xl font-black">{count}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Questions</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartInterview}
                  disabled={starting || !role}
                  className="w-full py-5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 group"
                >
                  {starting ? 'Initializing AI Engine...' : 'Launch Interview'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            AI Model: Mistral & Groq
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            STAR Methodology
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Real-time Feedback
          </div>
        </div>
      </div>
    </main>
  );
}
