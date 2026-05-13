'use client';

import { Trophy, Award, CheckCircle2, ShieldCheck, Share2, Download, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificateProps {
  userName: string;
  role: string;
  averageScore: number;
  totalSessions: number;
  date: string;
}

export default function ReadinessCertificate({ userName, role, averageScore, totalSessions, date }: CertificateProps) {
  return (
    <div className="relative group max-w-3xl mx-auto">
      {/* Decorative Blur Background */}
      <div className="absolute -inset-1 bg-linear-to-r from-accent via-blue-500 to-indigo-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-white dark:bg-[#050505] rounded-[38px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
        {/* Certificate Header */}
        <div className="h-4 bg-linear-to-r from-accent via-blue-500 to-indigo-600"></div>
        
        <div className="p-12 md:p-16 space-y-12 text-center">
          {/* Logo & Seal */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
              <span className="text-sm font-black uppercase tracking-tighter text-slate-900 dark:text-white">PrepMate AI</span>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-accent/20 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse"></div>
              <Award className="text-accent" size={40} />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Interview Readiness Certificate</p>
            <h2 className="text-sm font-medium text-slate-500 italic">This is to certify that</h2>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{userName}</h1>
            <div className="h-px w-32 bg-slate-200 dark:bg-white/10 mx-auto"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Has demonstrated exceptional proficiency in <span className="font-bold text-slate-900 dark:text-white">{role}</span> interviews, achieving an elite performance threshold of <span className="text-accent font-bold">{averageScore}%</span> across <span className="font-bold text-slate-900 dark:text-white">{totalSessions}</span> intensive AI-driven simulations.
            </p>
          </div>

          {/* Verification Stats */}
          <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-100 dark:border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Score</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{averageScore}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tier</p>
              <p className="text-xl font-bold text-accent">Platinum</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
              <p className="text-xl font-bold text-green-500 flex items-center justify-center gap-1">
                <CheckCircle2 size={16} /> Verified
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-8">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Issued on {date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verification ID: PM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Download size={14} /> Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
