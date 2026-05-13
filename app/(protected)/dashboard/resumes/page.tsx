'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock,
  Briefcase,
  Flame,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const handleSetActive = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Set all others to inactive
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // 2. Set this one to active
      const { error } = await supabase
        .from('resumes')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setResumes(resumes.map(r => ({
        ...r,
        is_active: r.id === id
      })));

      // Also update the profiles table for backward compatibility/quick access
      const activeResume = resumes.find(r => r.id === id);
      await supabase
        .from('profiles')
        .update({ 
          resume_url: activeResume.resume_url,
          resume_data: activeResume.resume_data 
        })
        .eq('id', user.id);

    } catch (err) {
      console.error('Error setting active resume:', err);
    }
  };

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.resume_data?.suggested_role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Resumes</h1>
          <p className="text-slate-500 font-medium">Manage and optimize your resumes for different career paths.</p>
        </div>
        <Link 
          href="/dashboard/profile/edit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
        >
          <Plus size={18} />
          Upload New Resume
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search resumes by name or role..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
        />
      </div>

      {/* Resume Grid */}
      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <Link 
              key={resume.id}
              href={`/dashboard/resumes/${resume.id}`}
              className={`
                group relative bg-white dark:bg-slate-900 rounded-[32px] border-2 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5
                ${resume.is_active ? 'border-accent ring-4 ring-accent/5' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                  ${resume.is_active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600'}
                `}>
                  <FileText size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {resume.is_active && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                      Active
                    </span>
                  )}
                  <button 
                    onClick={(e) => handleDelete(resume.id, e)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{resume.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Briefcase size={12} /> {resume.resume_data?.suggested_role || 'General Resume'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Analysis Status</span>
                  {resume.resume_data ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-1">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleSetActive(resume.id, e)}
                    disabled={resume.is_active}
                    className={`
                      flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${resume.is_active 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                        : 'bg-accent/10 text-accent hover:bg-accent hover:text-white shadow-sm'}
                    `}
                  >
                    Set Active
                  </button>
                  <div className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-white/5 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-300">
            <FileText size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No resumes found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Upload your first resume to start getting personalized interview practice and AI-powered roasts.
            </p>
          </div>
          <Link 
            href="/dashboard/profile/edit"
            className="inline-flex px-8 py-3 bg-accent text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-accent/20"
          >
            Upload Now
          </Link>
        </div>
      )}
    </div>
  );
}
