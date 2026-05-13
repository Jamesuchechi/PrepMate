'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Settings, 
  Bell, 
  Shield, 
  Trash2, 
  Cpu, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Lock,
  ChevronRight,
  AlertTriangle,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    tips: false
  });
  const [aiModel, setAiModel] = useState('mistral');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your application preferences and account security.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* App Preferences */}
        <motion.div variants={itemVariants} className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI & Performance</h3>
              <p className="text-sm text-slate-500">Configure your primary AI model and engine settings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'mistral', name: 'Mistral Large', desc: 'Balanced & fast reasoning', icon: Cpu },
              { id: 'groq', name: 'Groq (Llama 3)', desc: 'Ultra-fast real-time feedback', icon: Zap }
            ].map((model) => (
              <button
                key={model.id}
                onClick={() => setAiModel(model.id)}
                className={`p-6 rounded-3xl border-2 text-left transition-all ${
                  aiModel === model.id 
                    ? 'border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/5' 
                    : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${aiModel === model.id ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                    <model.icon size={20} />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${aiModel === model.id ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {aiModel === model.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">{model.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{model.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-slate-500">Stay updated on your progress and daily tips.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive weekly progress reports and feedback summaries.', icon: Mail },
              { id: 'browser', label: 'Browser Alerts', desc: 'Get reminded when it\'s time for your daily practice.', icon: Smartphone },
              { id: 'tips', label: 'AI Daily Tips', desc: 'Get brutally honest interview advice every morning.', icon: Sparkles },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-purple-500 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.id as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div variants={itemVariants} className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security & Account</h3>
              <p className="text-sm text-slate-500">Manage your password and authentication methods.</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-green-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                  <Lock size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Update Password</p>
                  <p className="text-xs text-slate-500">Ensure your account stays protected.</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants} className="p-8 md:p-10 bg-red-500/5 border border-red-500/10 rounded-[40px] shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
              <p className="text-sm text-red-500/60">Irreversible actions for your PrepMate account.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Delete Account</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">This will permanently delete all your interview history, feedback, and performance data. This cannot be undone.</p>
            </div>
            <button className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap">
              Delete Forever
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
