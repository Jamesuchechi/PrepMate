'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Check, X, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [strength, setStrength] = useState(0); // 0-3
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Simple password strength calculation
    if (!password) {
      setStrength(0);
      return;
    }
    let s = 0;
    if (password.length >= 8) s++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) s++;
    if (password.length >= 12 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (strength === 0) return { label: 'Too Weak', color: 'bg-red-500', icon: ShieldAlert };
    if (strength === 1) return { label: 'Weak', color: 'bg-orange-500', icon: Shield };
    if (strength === 2) return { label: 'Medium', color: 'bg-yellow-500', icon: ShieldCheck };
    return { label: 'Strong', color: 'bg-green-500', icon: ShieldCheck };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Box */}
      <div className="w-full max-w-[420px] mx-auto pt-12 pb-10 px-10 bg-black border border-slate-800 flex flex-col items-center shadow-2xl">
        <div className="mb-12 text-center">
           <h1 className="text-[46px] font-bold tracking-tighter text-white font-serif italic mb-2">
             PrepMate
           </h1>
           {mode === 'forgot' && (
             <p className="text-slate-400">Recover your account access.</p>
           )}
           {mode === 'signup' && (
             <p className="text-slate-400">Start your journey to interview success.</p>
           )}
        </div>

        <form onSubmit={handleAuth} className="w-full space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-[13px] bg-[#0A0A0A] border border-slate-800 text-white rounded-[4px] focus:border-slate-500 outline-none transition-all placeholder:text-slate-600"
            placeholder="Email address"
            required
          />
          
          {mode !== 'forgot' && (
            <>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-[13px] bg-[#0A0A0A] border border-slate-800 text-white rounded-[4px] focus:border-slate-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Password"
                  required
                />
                
                {mode === 'signup' && password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-500">Strength: <span className="font-bold text-white uppercase">{strengthInfo.label}</span></span>
                      <strengthInfo.icon size={12} className={strengthInfo.color.replace('bg-', 'text-')} />
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`h-full flex-1 transition-all duration-500 ${i <= strength ? strengthInfo.color : 'bg-slate-800'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mode === 'signup' && (
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 text-[13px] bg-[#0A0A0A] border ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-slate-800'} text-white rounded-[4px] focus:border-slate-500 outline-none transition-all placeholder:text-slate-600`}
                    placeholder="Confirm Password"
                    required={mode === 'signup'}
                  />
                  {confirmPassword && (
                    <div className="absolute right-3 top-3.5">
                      {password === confirmPassword ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 bg-[#0095F6] text-white font-bold rounded-[8px] hover:bg-[#1877F2] transition-all disabled:opacity-50 text-[14px] shadow-lg shadow-blue-500/10"
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Log in' : 
              mode === 'signup' ? 'Create Account' : 'Reset My Password'
            )}
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[13px] font-bold text-slate-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {mode !== 'forgot' ? (
            <button 
              type="button" 
              onClick={() => setMode('forgot')}
              className="w-full text-xs font-semibold text-white hover:text-accent transition-colors"
            >
               Forgot password?
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => setMode('login')}
              className="w-full text-xs font-bold text-white hover:text-accent transition-colors"
            >
               Back to Login
            </button>
          )}
        </form>

        {(error || message) && (
          <div className={`mt-6 p-4 w-full rounded-lg text-xs text-center border ${error ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
            {error || message}
          </div>
        )}
      </div>

      {/* Switch Box */}
      <div className="w-full max-w-[420px] mx-auto p-8 bg-black border border-slate-800 text-center text-sm text-white shadow-xl">
        <p className="text-[14px]">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="ml-2 text-[#0095F6] font-bold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
