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
  Home,
  Mic,
  MicOff
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
  const [resumeData, setResumeData] = useState<any>(null);

  // Voice Recording State (Whisper Upgrade)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob);

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.text) {
        setUserAnswer(prev => {
          const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + data.text;
        });
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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

      // Fetch Resume Data from Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('resume_data')
        .eq('id', sessionData.user_id)
        .single();
      
      if (profileData?.resume_data) {
        setResumeData(profileData.resume_data);
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
          generateNextQuestion(answersData, profileData?.resume_data);
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

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for professional feel
      utterance.pitch = 1.0;
      
      // Try to find a professional sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const generateNextQuestion = async (existingAnswers: any[], rData?: any) => {
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
          asked_questions: askedQuestions,
          resume_data: rData || resumeData
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCurrentQuestion(data.question);
      
      // Speak the question
      speakText(data.question);
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

    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          role: session.role,
          experience_level: session.experience_level,
          interview_type: session.interview_type,
          coach_personality: session.coach_personality
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Save to Supabase
      const { data: newAnswer, error: saveError } = await supabase
        .from('answers')
        .insert({
          session_id: sessionId,
          user_id: session.user_id,
          question: currentQuestion,
          answer: userAnswer,
          score_clarity: data.scores.clarity,
          score_confidence: data.scores.confidence,
          score_structure: data.scores.structure,
          score_relevance: data.scores.relevance,
          overall_score: data.overall_score,
          feedback: data.feedback,
          improvement_tip: data.improvement_tip
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setEvaluation(data);
      setAnswers([...answers, newAnswer]);

      // Update session total score
      const newTotalScore = [...answers, newAnswer].reduce((acc, curr) => acc + curr.overall_score, 0) / [...answers, newAnswer].length;
      await supabase
        .from('sessions')
        .update({ total_score: newTotalScore })
        .eq('id', sessionId);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const finishSession = async () => {
    await supabase
      .from('sessions')
      .update({ completed: true })
      .eq('id', sessionId);
    setCompleted(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (completed) {
    const avgScore = answers.reduce((acc, curr) => acc + curr.overall_score, 0) / (answers.length || 1);
    
    return (
      <main className="max-w-3xl mx-auto w-full py-12 px-6">
        <div className="bg-slate-900 border border-white/5 rounded-[48px] p-12 text-center space-y-8 relative overflow-hidden shadow-2xl">
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
        {!evaluation && !generating ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use the microphone..."
              className="w-full min-h-[300px] p-8 pb-24 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[40px] text-lg leading-relaxed outline-none transition-all resize-none shadow-2xl focus:border-blue-500/50"
              disabled={evaluating || generating || isTranscribing}
            />
            
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button
                onClick={toggleRecording}
                disabled={evaluating || generating || isTranscribing}
                className={`p-4 rounded-2xl transition-all flex items-center gap-2 font-bold ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="text-xs uppercase tracking-widest hidden sm:block">
                  {isRecording ? 'Stop Recording' : 'Voice Mode'}
                </span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || evaluating || generating || isTranscribing}
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale shadow-xl"
              >
                {evaluating || isTranscribing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> {isTranscribing ? 'Transcribing...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    Submit <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          evaluation && (
            <div className="w-full min-h-[150px] p-8 bg-slate-50 dark:bg-[#0A0A0A] border border-green-500/20 rounded-[40px] text-lg leading-relaxed opacity-60">
              {userAnswer}
            </div>
          )
        )}
      </div>

      {/* Feedback Area */}
      {evaluation && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Clarity', val: evaluation.scores.clarity },
              { label: 'Confidence', val: evaluation.scores.confidence },
              { label: 'Structure', val: evaluation.scores.structure },
              { label: 'Relevance', val: evaluation.scores.relevance },
            ].map((score) => (
              <div key={score.label} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{score.val}%</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{score.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] space-y-4 shadow-sm relative group/feedback">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-500">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-black uppercase tracking-widest">Feedback</span>
                  </div>
                  <button 
                    onClick={() => speakText(evaluation.feedback)}
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                    title="Speak feedback"
                  >
                    <Mic size={18} />
                  </button>
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
