'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Zap, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarmupPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
      generateFlashcards(profileData?.target_role || 'Software Engineer');
    }
    init();
  }, []);

  async function generateFlashcards(role: string) {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await response.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error('Error generating flashcards:', err);
    } finally {
      setLoading(false);
    }
  }

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Generating Technical Flashcards...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
            {profile?.target_role || 'General'}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Technical Warm-up</h1>
        <p className="text-slate-500 font-medium">Quick-fire technical drills to get your brain in interview mode.</p>
      </div>

      {/* Flashcard Area */}
      <div className="relative h-[400px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full cursor-pointer relative preserve-3d transition-transform duration-500"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-[48px] p-12 flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="absolute top-8 left-8 p-3 bg-accent/10 text-accent rounded-2xl">
                <HelpCircle size={24} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {cards[currentIndex]?.question}
              </p>
              <div className="absolute bottom-8 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <RotateCw size={12} /> Click to reveal answer
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 backface-hidden bg-slate-900 text-white rounded-[48px] p-12 flex flex-col items-center justify-center text-center shadow-2xl border-2 border-accent/20"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="absolute top-8 left-8 p-3 bg-green-500/10 text-green-500 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div className="space-y-4 overflow-y-auto max-h-full">
                <p className="text-xl font-medium text-slate-200 leading-relaxed">
                  {cards[currentIndex]?.answer}
                </p>
                <div className="pt-4 flex flex-wrap gap-2 justify-center">
                  {cards[currentIndex]?.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={prevCard}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl text-slate-400 hover:text-accent hover:border-accent/50 transition-all shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => generateFlashcards(profile?.target_role)}
          className="px-8 py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-black rounded-3xl text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all"
        >
          <RotateCw size={16} /> Refresh Deck
        </button>
        <button 
          onClick={nextCard}
          className="p-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent/20"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-accent/5 rounded-[40px] border border-accent/10 flex items-start gap-4">
        <div className="p-3 bg-accent/20 text-accent rounded-2xl">
          <Zap size={24} fill="currentColor" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white">Pro Tip</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Try to answer out loud in under 30 seconds. In a real interview, you won't have more than a minute for these technical rapid-fires.
          </p>
        </div>
      </div>
    </div>
  );
}
