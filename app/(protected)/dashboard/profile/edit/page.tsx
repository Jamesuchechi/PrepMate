'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { uploadAvatar } from '@/lib/storage';
import { 
  User, 
  Camera, 
  Save, 
  Briefcase, 
  Trophy, 
  Mail, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [skillStats, setSkillStats] = useState({
    clarity: 0,
    confidence: 0,
    structure: 0,
    relevance: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setTargetRole(profileData.target_role || '');
          setExperienceLevel(profileData.experience_level || '');
          setAvatarUrl(profileData.avatar_url || null);
        }

        // Fetch Skill Averages
        const { data: answers } = await supabase
          .from('answers')
          .select('score_clarity, score_confidence, score_structure, score_relevance')
          .eq('user_id', user.id);

        if (answers && answers.length > 0) {
          const count = answers.length;
          setSkillStats({
            clarity: Math.round(answers.reduce((acc, a) => acc + (a.score_clarity || 0), 0) / count),
            confidence: Math.round(answers.reduce((acc, a) => acc + (a.score_confidence || 0), 0) / count),
            structure: Math.round(answers.reduce((acc, a) => acc + (a.score_structure || 0), 0) / count),
            relevance: Math.round(answers.reduce((acc, a) => acc + (a.score_relevance || 0), 0) / count),
          });
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setSaving(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (updateError) throw updateError;
      setSuccess('Profile picture updated!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          target_role: targetRole,
          experience_level: experienceLevel,
        });

      if (updateError) throw updateError;
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link 
        href="/dashboard/profile" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="text-white" size={24} />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Basic Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{fullName || 'New Candidate'}</h1>
          <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={16} /> {email}
          </p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/20">
              {targetRole || 'Select Role'}
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full capitalize border border-slate-200 dark:border-slate-700">
              {experienceLevel || 'Select Level'} Level
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex gap-4 border-l border-slate-200 dark:border-slate-800 pl-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.current_streak || 0}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.longest_streak || 0}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Record</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <ShieldCheck className="text-accent" size={20} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm text-slate-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Role</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm text-slate-900 dark:text-white"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['entry', 'mid', 'senior'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        experienceLevel === level 
                        ? 'bg-accent text-white border-accent' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  {error && <span className="text-red-500 flex items-center gap-1"><AlertCircle size={14} /> {error}</span>}
                  {success && <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={14} /> {success}</span>}
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              Skill Progress
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400">
                  <span>Clarity</span>
                  <span>{skillStats.clarity}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${skillStats.clarity}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400">
                  <span>Confidence</span>
                  <span>{skillStats.confidence}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${skillStats.confidence}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400">
                  <span>Structure</span>
                  <span>{skillStats.structure}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${skillStats.structure}%` }}></div>
                </div>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="w-full block mt-6 py-3 border border-slate-700 text-center text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
            >
              View Detailed Analytics
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Subscription</h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Plan</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Free Tier</p>
              </div>
              <ChevronRight className="text-slate-400" size={20} />
            </div>
            <button className="w-full mt-4 py-3 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent hover:text-white transition-all">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
