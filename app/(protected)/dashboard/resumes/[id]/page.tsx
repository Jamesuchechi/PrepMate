'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Briefcase, 
  Target, 
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  Sparkles,
  Download,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roasting, setRoasting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchResume();
  }, [params.id]);

  async function fetchResume() {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setResume(data);
      setNewName(data.name);
    } catch (err) {
      console.error('Error fetching resume:', err);
      router.push('/dashboard/resumes');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ name: newName })
        .eq('id', resume.id);

      if (error) throw error;
      setResume({ ...resume, name: newName });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  const handleRoast = async () => {
    if (roasting) return;
    setRoasting(true);
    try {
      const response = await fetch('/api/roast-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resume.resume_data,
          role: resume.resume_data?.suggested_role
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Save roast to DB
      const { error: saveError } = await supabase
        .from('resumes')
        .update({ roast_text: data.roast })
        .eq('id', resume.id);

      if (saveError) throw saveError;
      setResume({ ...resume, roast_text: data.roast });
    } catch (err) {
      console.error('Error roasting resume:', err);
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/resumes"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Resumes
        </Link>
        <div className="flex items-center gap-3">
          <a 
            href={resume.resume_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 hover:text-accent transition-all"
          >
            <Download size={18} />
          </a>
          <button 
            onClick={() => router.push('/dashboard/resumes')}
            className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Delete
          </button>
          <Link 
            href="/dashboard/resumes/refiner"
            className="px-6 py-3 bg-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
          >
            <Sparkles size={14} /> Refine Bullets
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className={`
            w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl
            ${resume.is_active ? 'bg-accent text-white shadow-accent/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
          `}>
            <FileText size={40} />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-slate-50 dark:bg-white/5 border border-accent rounded-lg px-3 py-1 text-2xl font-black outline-none"
                  />
                  <button onClick={handleUpdateName} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg">
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              ) : (
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  {resume.name}
                  <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-accent transition-colors">
                    <Edit3 size={18} />
                  </button>
                </h1>
              )}
              {resume.is_active && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                  Active for Interviews
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" />
                {resume.resume_data?.suggested_role || 'General Role'}
              </span>
              <span className="flex items-center gap-2">
                <Target size={16} className="text-slate-400" />
                {resume.resume_data?.experience_level || 'All Levels'}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                Uploaded {new Date(resume.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Roast Section */}
          <div className="bg-slate-900 rounded-[40px] p-10 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                  <Flame size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">The Resume Roast</h3>
                  <p className="text-xs text-slate-500">AI-powered brutal honesty about your career doc.</p>
                </div>
              </div>
              <button 
                onClick={handleRoast}
                disabled={roasting}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-2"
              >
                {roasting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {resume.roast_text ? 'Roast Again' : 'Generate Roast'}
              </button>
            </div>

            {resume.roast_text ? (
              <div className="prose prose-invert max-w-none">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-orange-100/80 italic leading-relaxed whitespace-pre-wrap">
                  {resume.roast_text}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <p className="text-slate-400 text-sm font-medium">No roast generated yet. Dare to see the truth?</p>
                <button 
                  onClick={handleRoast}
                  className="px-8 py-3 bg-orange-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                >
                  🔥 Burn It Down
                </button>
              </div>
            )}
          </div>

          {/* Detailed Skills & Projects */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 p-10 space-y-10">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-accent" size={20} />
                Extracted Skills
              </h3>
            <div className="flex flex-wrap gap-3">
                {resume.resume_data?.skills?.map((skill: string) => {
                  const isVerified = Math.random() > 0.5; // Placeholder logic: in prod this would check answer scores
                  return (
                    <span key={skill} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                      isVerified 
                        ? 'bg-green-500/5 text-green-600 border-green-500/20 shadow-sm shadow-green-500/5' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-white/5'
                    }`}>
                      {skill}
                      {isVerified && <ShieldCheck size={14} />}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="text-accent" size={20} />
                Key Projects & Experience
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.resume_data?.projects?.map((project: string) => (
                  <div key={project} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{project}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Stats */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Summary</h3>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "{resume.resume_data?.summary || 'No summary available for this resume.'}"
            </p>
          </div>

          <div className="bg-accent/5 rounded-[40px] border border-accent/20 p-8 space-y-6">
            <h3 className="text-lg font-bold text-accent">Personalization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              When this resume is <strong>Active</strong>, PrepMate will prioritize these skills and projects in your interview sessions.
            </p>
            {!resume.is_active && (
              <button className="w-full py-4 bg-accent text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-accent/20">
                Activate Resume
              </button>
            )}
          </div>

          {/* Interview Bridge Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={20} className="text-orange-500" />
              Predicted Questions
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Based on your projects</p>
            <div className="space-y-4">
              {resume.resume_data?.projects?.slice(0, 3).map((p: string, i: number) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group">
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 leading-relaxed group-hover:text-accent transition-colors">
                    "Tell me about a challenge you faced while working on {p.split(' ').slice(0, 3).join(' ')}..."
                  </p>
                  <Link href="/interview/setup" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                    Practice this →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
