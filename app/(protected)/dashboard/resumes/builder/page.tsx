'use client';

import { useState, useRef } from 'react';
import { 
  Layout, 
  FileText, 
  Download, 
  Sparkles, 
  Eye, 
  Type, 
  Palette, 
  CheckCircle2, 
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  ChevronRight,
  Zap,
  User,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  { id: 'silicon', name: 'Silicon Valley', description: 'Minimalist & High-Tech', icon: Layout },
  { id: 'executive', name: 'The Executive', description: 'Traditional & Bold', icon: FileText },
  { id: 'creative', name: 'The Creative', description: 'Modern & Multi-column', icon: Palette },
  { id: 'academic', name: 'The Academic', description: 'Detailed & Multi-page', icon: GraduationCap }
];

export default function ResumeBuilderPage() {
  const [activeTemplate, setActiveTemplate] = useState('silicon');
  const [activeTab, setActiveTab] = useState('template');
  const [isPreview, setIsPreview] = useState(false);
  const [jd, setJd] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optResults, setOptResults] = useState<any>(null);
  
  // Resume Data State
  const [data, setData] = useState({
    name: 'James Uchechi',
    email: 'james@example.com',
    phone: '+1 234 567 890',
    website: 'prep-mate.com',
    role: 'Senior Software Engineer',
    summary: 'Experienced software engineer with a focus on building scalable web applications and AI integration.',
    experience: [
      { company: 'Tech Corp', role: 'Full Stack Developer', period: '2022 - Present', bullets: ['Led migration to Next.js', 'Reduced bundle size by 40%'] },
    ],
    education: [
      { school: 'State University', degree: 'B.S. Computer Science', period: '2018 - 2022' }
    ],
    skills: ['React', 'Next.js', 'PostgreSQL', 'AI/ML']
  });

  const handleOptimize = async () => {
    if (!jd.trim()) return;
    setOptimizing(true);
    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_data: data, job_description: jd })
      });
      const result = await response.json();
      setOptResults(result);
      if (result.tailored_summary) {
        setData(prev => ({ ...prev, summary: result.tailored_summary }));
      }
    } catch (err) {
      console.error('Error optimizing:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/resumes" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Resume Builder</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Phase 11: Career Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            {isPreview ? <Edit size={16} /> : <Eye size={16} />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-accent/20"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        {/* Left: Controls */}
        <div className={`w-96 flex flex-col gap-6 transition-all duration-500 ${isPreview ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
          {/* Tabs */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-white/5 flex">
            {['template', 'content', 'optimize'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/5 p-8 overflow-y-auto custom-scrollbar">
            {activeTab === 'template' && (
              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Choose Template</h3>
                <div className="space-y-3">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTemplate(t.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-4 text-left group ${activeTemplate === t.id ? 'border-accent bg-accent/5' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-slate-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTemplate === t.id ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        <t.icon size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <p className={`font-bold text-sm ${activeTemplate === t.id ? 'text-accent' : 'text-slate-900 dark:text-white'}`}>{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={18} className="text-accent" /> Personal Info
                  </h3>
                  <div className="space-y-3">
                    <input type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium" placeholder="Full Name" />
                    <input type="text" value={data.role} onChange={(e) => setData({...data, role: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium" placeholder="Current Role" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase size={18} className="text-accent" /> Experience
                    </h3>
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-accent"><Plus size={14}/></button>
                  </div>
                  {data.experience.map((exp, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 relative group">
                      <input type="text" value={exp.company} className="w-full bg-transparent font-bold text-xs outline-none" />
                      <input type="text" value={exp.role} className="w-full bg-transparent text-[10px] text-slate-500 outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'optimize' && (
              <div className="space-y-8">
                <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <Zap size={18} className="text-orange-500" /> ATS Match Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="3"></circle>
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="16" 
                          fill="none" 
                          className="stroke-accent transition-all duration-1000" 
                          strokeWidth="3" 
                          strokeDasharray="100" 
                          strokeDashoffset={100 - (optResults?.ats_score || 0)}
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                        {optResults?.ats_score || 0}%
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      {optResults ? 'Optimization analysis complete.' : 'Paste a job description to calculate your match score.'}
                    </p>
                  </div>
                </div>

                {optResults && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {optResults.missing_keywords.map((k: string) => (
                          <span key={k} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold border border-red-500/20">
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tailoring Suggestions</p>
                      <ul className="space-y-2">
                        {optResults.tailoring_suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Job Description</label>
                  <textarea 
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the job description here to auto-tailor your resume..." 
                    className="w-full h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-xs font-medium outline-none border border-transparent focus:border-accent"
                  />
                  <button 
                    onClick={handleOptimize}
                    disabled={optimizing || !jd.trim()}
                    className="w-full py-4 bg-accent text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    {optimizing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    {optimizing ? 'Analyzing...' : 'Tailor Resume'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className={`flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-100 dark:bg-black/40 rounded-[40px] p-12 transition-all duration-500 ${isPreview ? 'max-w-4xl mx-auto' : ''}`}>
          <div id="resume-canvas" className={`
            bg-white text-slate-900 shadow-2xl mx-auto transition-all duration-500 origin-top
            ${activeTemplate === 'silicon' ? 'w-[800px] min-h-[1100px] p-16 space-y-8' : ''}
            ${activeTemplate === 'executive' ? 'w-[800px] min-h-[1100px] p-12 space-y-10 border-t-12 border-slate-900' : ''}
            ${activeTemplate === 'creative' ? 'w-[800px] min-h-[1100px] flex gap-0' : ''}
          `}>
            {/* Silicon Template */}
            {activeTemplate === 'silicon' && (
              <>
                <div className="space-y-2 text-center border-b pb-8 border-slate-100">
                  <h1 className="text-4xl font-black tracking-tight uppercase">{data.name}</h1>
                  <p className="text-accent font-bold tracking-widest text-xs uppercase">{data.role}</p>
                  <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-2">
                    <span>{data.email}</span>
                    <span>•</span>
                    <span>{data.phone}</span>
                    <span>•</span>
                    <span>{data.website}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional Summary</h2>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">{data.summary}</p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Experience</h2>
                  <div className="space-y-8">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <h3 className="font-bold text-lg">{exp.company}</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <p className="text-xs font-black text-accent uppercase tracking-widest">{exp.role}</p>
                        <ul className="space-y-2 pt-2">
                          {exp.bullets.map((b, bi) => (
                            <li key={bi} className="text-sm text-slate-600 font-medium flex gap-3">
                              <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-900 uppercase tracking-widest rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Executive Template */}
            {activeTemplate === 'executive' && (
              <div className="space-y-10 font-serif">
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{data.name}</h1>
                  <div className="flex gap-4 text-xs font-bold text-slate-500 border-y border-slate-100 py-3">
                    <span>{data.email}</span>
                    <span>{data.phone}</span>
                    <span>{data.website}</span>
                  </div>
                </div>
                {/* ... Add executive specific layout ... */}
                <p className="text-sm italic text-slate-600 border-l-4 border-slate-900 pl-6 py-2 bg-slate-50">
                  {data.summary}
                </p>
                <div className="space-y-8">
                   <h2 className="text-sm font-black uppercase border-b-2 border-slate-900 pb-1">Professional Experience</h2>
                   {data.experience.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="italic text-slate-500">{exp.role}</p>
                      </div>
                   ))}
                </div>
              </div>
            )}

             {/* Creative Template */}
             {activeTemplate === 'creative' && (
              <div className="flex flex-1">
                <div className="w-1/3 bg-slate-900 text-white p-12 space-y-10">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black leading-none">{data.name.split(' ')[0]}<br/>{data.name.split(' ')[1]}</h1>
                    <p className="text-accent text-[10px] font-black uppercase tracking-widest pt-2">{data.role}</p>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</h2>
                    <div className="space-y-2 text-[10px] font-medium text-slate-300">
                      <p>{data.email}</p>
                      <p>{data.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expertise</h2>
                    <div className="flex flex-col gap-2">
                      {data.skills.map(s => (
                        <span key={s} className="text-xs font-bold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-16 bg-white space-y-12">
                   <div className="space-y-4">
                      <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Profile</h2>
                      <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
                   </div>
                   <div className="space-y-8">
                      <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Experience</h2>
                      {data.experience.map((exp, i) => (
                        <div key={i} className="space-y-2">
                          <h3 className="font-bold">{exp.company}</h3>
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest">{exp.role}</p>
                          <ul className="space-y-1 pt-2">
                            {exp.bullets.map((b, bi) => (
                              <li key={bi} className="text-xs text-slate-500">• {b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #resume-canvas { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important;
            padding: 0 !important;
          }
          aside, nav, button, .top-header { display: none !important; }
        }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .perspective-1000 { perspective: 1000px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function Edit({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}
