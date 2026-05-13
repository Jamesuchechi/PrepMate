'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  ChevronRight,
  Inbox,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setNotifications(data || []);
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = async (id: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Stay updated with your interview insights and account activity.</p>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl">
          <Bell className="text-accent" size={24} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id}
              className={`group relative p-6 rounded-[32px] border transition-all flex gap-6 ${
                n.read 
                  ? 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 opacity-80' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'success' ? 'bg-green-500/10 text-green-500' :
                n.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                n.type === 'error' ? 'bg-red-500/10 text-red-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {n.type === 'success' ? <CheckCircle2 size={20} /> :
                 n.type === 'warning' ? <AlertCircle size={20} /> :
                 n.type === 'error' ? <AlertCircle size={20} /> :
                 <Info size={20} />}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`font-bold text-slate-900 dark:text-white truncate ${n.read ? 'font-medium' : 'font-black'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <div className="pt-3 flex items-center gap-4">
                  <Link 
                    href={n.link || `/dashboard/notifications/${n.id}`}
                    onClick={() => !n.read && markAsRead(n.id)}
                    className="text-xs font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                  {!n.read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteNotification(n.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Inbox size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your inbox is empty</h3>
              <p className="text-slate-500 text-sm mt-1">We'll notify you when your interview feedback is ready or there are new tips available.</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
