'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function NotificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchNotification() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (data) {
        setNotification(data);
        // Mark as read when viewing detail
        if (!data.read) {
          await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', data.id);
        }
      }
      setLoading(false);
    }
    fetchNotification();
  }, [resolvedParams.id]);

  const deleteNotification = async () => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', resolvedParams.id);
    router.push('/dashboard/notifications');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400">
          <AlertCircle size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Notification not found</h2>
          <p className="text-slate-500 mt-2">This notification might have been deleted or moved.</p>
        </div>
        <Link href="/dashboard/notifications" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold">
          Go back to inbox
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8 pb-20"
    >
      <motion.div variants={itemVariants}>
        <Link 
          href="/dashboard/notifications" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to inbox
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="p-10 md:p-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[48px] shadow-sm space-y-10 relative overflow-hidden">
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'warning' ? 'bg-orange-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`} />

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
              notification.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
              notification.type === 'error' ? 'bg-red-500/10 text-red-500' :
              'bg-blue-500/10 text-blue-500'
            }`}>
              {notification.type}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <span className="text-xs font-bold">{new Date(notification.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {notification.title}
          </h1>

          <div className="h-px bg-slate-100 dark:bg-white/5 w-full" />

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {notification.message}
            </p>
          </div>

          {notification.link && (
            <div className="pt-6">
              <Link 
                href={notification.link}
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all"
              >
                Continue Action <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>

        <div className="pt-10 flex items-center justify-between border-t border-slate-100 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-3 text-slate-400">
            <Clock size={16} />
            <span className="text-xs font-bold">Received {new Date(notification.created_at).toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={deleteNotification}
            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} /> Delete this message
          </button>
        </div>
      </motion.div>

      {/* Recommended Next Step Card */}
      <motion.div variants={itemVariants} className="p-8 bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-[40px] shadow-xl flex items-center justify-between gap-8 group">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Recommended</span>
          </div>
          <h3 className="text-xl font-bold">Ready for your next session?</h3>
          <p className="text-slate-400 text-sm">Consistent practice is the fastest way to master your {notification.role || 'interview'} skills.</p>
        </div>
        <Link href="/interview/setup" className="p-5 bg-white text-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
          <ArrowRight size={24} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}
