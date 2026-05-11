'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[350px] p-10 bg-black border border-slate-800 flex flex-col items-center">
        <div className="mb-10 text-center">
          <h1 className="text-[36px] font-bold tracking-tighter text-white font-serif italic">
            PrepMate
          </h1>
          <p className="text-sm text-slate-400 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleReset} className="w-full space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-2.5 text-[12px] bg-[#121212] border border-slate-800 text-white rounded-[3px] focus:border-slate-500 outline-none transition-all placeholder:text-slate-500"
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-2 py-2.5 text-[12px] bg-[#121212] border border-slate-800 text-white rounded-[3px] focus:border-slate-500 outline-none transition-all placeholder:text-slate-500"
            placeholder="Confirm New Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-1.5 bg-[#0095F6] text-white font-semibold rounded-[8px] hover:bg-[#1877F2] transition-all disabled:opacity-50 text-[14px]"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 text-xs text-green-500 text-center">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
