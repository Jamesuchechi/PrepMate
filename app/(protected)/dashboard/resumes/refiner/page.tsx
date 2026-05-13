'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Target, 
  BarChart2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BulletRefinerPage() {
  const [input, setInput] = useState('');
  const [refining, setRefining] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRefine = async () => {
    if (!input.trim() || refining) return;
    setRefining(true);
    try {
      const response = await fetch('/api/refine-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: input })
      });
      const data = await response.json();
      setResults(data.options || []);
    } catch (err) {
      console.error('Error refining bullets:', err);
    } finally {
      setRefining(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/resumes"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Resumes
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
          <Sparkles size={14} /> AI Powered
        </div>
      </div>

      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">STAR Bullet Refiner</h1>
        <p className="text-slate-500 text-lg font-medium">Turn your job duties into high-impact accomplishments using the STAR framework.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Original Bullet</h3>
            </div>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Responsible for managing the company website and fixing bugs."
              className="w-full h-40 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-3xl p-6 text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
            />

            <button 
              onClick={handleRefine}
              disabled={refining || !input.trim()}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-3xl uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
            >
              {refining ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {refining ? 'Refining...' : 'Refine with STAR'}
            </button>
          </div>

          <div className="p-8 bg-accent/5 rounded-[40px] border border-accent/10 space-y-4">
            <h4 className="font-bold text-accent flex items-center gap-2">
              <Zap size={18} fill="currentColor" /> What is STAR?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Situation:</strong> Set the context.<br/>
              <strong>Task:</strong> What needed to be done?<br/>
              <strong>Action:</strong> What did YOU specifically do?<br/>
              <strong>Result:</strong> What was the measurable outcome?
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-[#050505] rounded-[40px] border border-slate-800 p-10 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <BarChart2 className="text-accent" size={24} />
                High-Impact Options
              </h3>
              {results.length > 0 && (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  Ready
                </span>
              )}
            </div>

            <div className="space-y-4 flex-1">
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  results.map((opt, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-slate-300 leading-relaxed pr-8">
                          {opt.bullet}
                        </p>
                        <button 
                          onClick={() => copyToClipboard(opt.bullet, i)}
                          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-accent transition-colors"
                        >
                          {copiedIndex === i ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${opt.impact_score}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {opt.impact_score}% Impact
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : refining ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="animate-spin text-accent" size={40} />
                    <p className="text-slate-500 text-sm font-medium">Analyzing metrics and action verbs...</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <Sparkles size={48} className="text-slate-700" />
                    <p className="text-slate-500 text-sm font-medium">Refined bullets will appear here</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
