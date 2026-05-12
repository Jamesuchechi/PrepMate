'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Trophy, 
  Calendar, 
  Target, 
  MessageSquare, 
  CheckCircle2, 
  Lightbulb,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import CountUp from '@/components/animations/CountUp';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.session_id as string;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: sessionData } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single();
        
        setSession(sessionData);

        const { data: answersData } = await supabase
          .from('answers')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });
        
        setAnswers(answersData || []);
      } catch (err) {
        console.error('Error fetching session details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Session not found</h2>
        <Link href="/history" className="text-accent hover:underline mt-4 inline-block">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Back Button & Header */}
      <div className="space-y-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Back to History
        </button>
        
        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{session.interview_type}</span>
                </div>
                <span className="text-slate-400 font-medium text-sm flex items-center gap-1.5">
                  <Calendar size={14} /> {new Date(session.created_at).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {session.role} <span className="text-slate-400 font-normal">Interview</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Experience Level: <span className="text-slate-900 dark:text-slate-300 capitalize">{session.experience_level}</span>
              </p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl text-center min-w-[160px] shadow-xl shadow-black/20">
              <p className="text-4xl font-black">
                <CountUp end={Math.round(session.total_score || 0)} suffix="%" />
              </p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">Overall Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white px-2">Detailed Q&A Review</h2>
        
        {answers.map((answer, index) => (
          <div 
            key={answer.id}
            className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[40px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Question Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <Target size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Question {index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {answer.question}
              </h3>
            </div>

            <div className="p-8 space-y-8">
              {/* User Answer */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Your Response</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-6 rounded-2xl italic">
                  "{answer.answer}"
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Clarity', val: answer.score_clarity },
                  { label: 'Confidence', val: answer.score_confidence },
                  { label: 'Structure', val: answer.score_structure },
                  { label: 'Relevance', val: answer.score_relevance },
                ].map(score => (
                  <div key={score.label} className="bg-slate-50 dark:bg-white/2 p-4 rounded-2xl">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{score.label}</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        <CountUp end={score.val} suffix="%" />
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${score.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">AI Feedback</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {answer.feedback}
                  </p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Lightbulb size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Actionable Tip</span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-blue-100/90 font-medium leading-relaxed">
                    {answer.improvement_tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="pt-10 text-center">
        <Link 
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-10 py-5 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all"
        >
          Practice Similar Role <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
