'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const ROLES = [
  'Software Engineer', 'Product Manager', 'Data Analyst', 
  'UX Designer', 'Marketing', 'Finance', 'Operations', 'Other'
];

const LEVELS = ['Entry', 'Mid', 'Senior'];

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState(LEVELS[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: fullName,
        target_role: targetRole,
        experience_level: experienceLevel.toLowerCase(),
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tell us about your career goals to personalize your coaching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-accent outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-accent outline-none"
            >
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperienceLevel(level)}
                  className={`py-2 rounded-lg border transition-all font-medium ${
                    experienceLevel === level 
                      ? 'bg-accent text-accent-foreground border-accent' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </main>
  );
}
