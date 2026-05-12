'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Trophy, 
  Target,
  BarChart3,
  Lightbulb,
  AlertCircle,
  Loader2,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import CountUp from '@/components/animations/CountUp';
import confetti from 'canvas-confetti';

export default function InterviewSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    if (completed) {
      const avgScore = answers.reduce((acc, curr) => acc + curr.overall_score, 0) / (answers.length || 1);
      if (avgScore >= 85) {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    }
  }, [completed, answers]);

  const fetchSessionData = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      if (sessionData.completed) {
        setCompleted(true);
      }

      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;
      setAnswers(answersData || []);

      if (!sessionData.completed) {
        if (answersData && answersData.length < sessionData.question_count) {
          generateNextQuestion(answersData);
        } else if (answersData && answersData.length >= sessionData.question_count) {
          finishSession();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNextQuestion = async (existingAnswers: any[]) => {
    setGenerating(true);
    setEvaluation(null);
    setUserAnswer('');
    
    try {
      const askedQuestions = existingAnswers.map(a => a.question);
      
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: session?.role || 'Software Engineer',
          experience_level: session?.experience_level || 'entry',
          interview_type: session?.interview_type || 'behavioral',
          asked_questions: askedQuestions
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCurrentQuestion(data.question);
    } catch (err: any) {
      setError("Failed to generate question. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || evaluating) return;
    setEvaluating(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          role: session.role,
          experience_level: session.experience_level,
          interview_type: session.interview_type
        })
      });

      const evalData = await response.json();
      if (evalData.error) throw new Error(evalData.error);
      
      setEvaluation(evalData);

      const { data: newAnswer, error: saveError } = await supabase
        .from('answers')
        .insert({
          session_id: sessionId,
          user_id: session.user_id,
          question: currentQuestion,
          answer: userAnswer,
          score_clarity: evalData.scores.clarity,
          score_confidence: evalData.scores.confidence,
          score_structure: evalData.scores.structure,
          score_relevance: evalData.scores.relevance,
          overall_score: evalData.scores.overall,
          feedback: evalData.feedback,
          improvement_tip: evalData.improvement_tip
        })
        .select()
        .single();

      if (saveError) throw saveError;

      const newAnswersList = [...answers, newAnswer];
      setAnswers(newAnswersList);

      const avgScore = newAnswersList.reduce((acc, curr) => acc + curr.overall_score, 0) / newAnswersList.length;
      
      await supabase
        .from('sessions')
        .update({ total_score: avgScore })
        .eq('id', sessionId);

    } catch (err: any) {
      setError(err.message || "Evaluation failed. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const finishSession = async () => {
    setLoading(true);
    try {
      await supabase
        .from('sessions')
        .update({ completed: true })
        .eq('id', sessionId);
      setCompleted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-500 font-medium">Syncing session state...</p>
      </div>
    );
  }

  if (completed) {
    const avgScore = answers.reduce((acc, curr) => acc + curr.overall_score, 0) / (answers.length || 1);
    
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
          {avgScore >= 85 && (
            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-pulse" />
          )}
          
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 relative z-10">
            <Trophy className="text-blue-500" size={48} />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h1 className="text-4xl font-black tracking-tight">
              {avgScore >= 85 ? 'Absolutely Brilliant!' : 'Interview Complete!'}
            </h1>
            <p className="text-slate-400">
              {avgScore >= 85 
                ? "You've crushed this session. Your preparation is really paying off." 
                : `You've successfully finished your ${session?.interview_type} practice.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/5 relative z-10">
            <div className="space-y-1">
              <p className="text-4xl font-black text-white">
                <CountUp end={Math.round(avgScore)} suffix="%" />
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Overall Score</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black text-white">
                <CountUp end={answers.length} />
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Questions Answered</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <Link 
              href="/dashboard"
              className="flex-1 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <Home size={18} /> Dashboard
            </Link>
            <Link 
              href="/interview/setup"
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Practice Again <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-10 pb-20">
      {/* Question Area */}
      <div className="space-y-4 pt-4">
        {generating ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-white/5 rounded" />
            <div className="h-20 w-full bg-slate-200 dark:bg-white/5 rounded-3xl" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-500">
                <BarChart3 size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Interviewer Question</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Question {answers.length + (evaluation ? 0 : 1)} of {session?.question_count}
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 dark:text-white">
              {currentQuestion || "Preparing your first question..."}
            </h2>
          </>
        )}
      </div>

      {/* Input / Evaluation Area */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          disabled={evaluating || !!evaluation || generating}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here... Be detailed, specific, and clear."
          className={`w-full min-h-[300px] p-8 bg-white dark:bg-[#0A0A0A] border rounded-[40px] text-lg leading-relaxed outline-none transition-all resize-none shadow-2xl ${
            evaluation ? 'border-green-500/20' : 'border-slate-200 dark:border-white/5 focus:border-blue-500/50'
          }`}
        />
        
        {!evaluation && !generating && (
          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            <span className={`text-xs font-bold transition-colors ${userAnswer.length > 100 ? 'text-green-500' : 'text-slate-500'}`}>
              {userAnswer.length} characters
            </span>
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || evaluating}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-800 shadow-xl shadow-blue-500/10 active:scale-95"
            >
              {evaluating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Feedback Area */}
      {evaluation && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(evaluation.scores).map(([key, val]: [string, any]) => (
              <div key={key} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{val}%</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{key}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-500">
                <CheckCircle2 size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Feedback</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{evaluation.feedback}"
              </p>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[32px] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <Lightbulb size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Improvement Tip</span>
              </div>
              <p className="text-blue-900 dark:text-blue-100/80 leading-relaxed font-medium">
                {evaluation.improvement_tip}
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            {answers.length < session.question_count ? (
              <button
                onClick={() => generateNextQuestion(answers)}
                className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-white/5 group"
              >
                Next Question <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={finishSession}
                className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 group"
              >
                Complete Practice <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
