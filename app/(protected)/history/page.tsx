'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  History, 
  MessageSquare, 
  ChevronRight, 
  Calendar, 
  Target,
  ArrowRight,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';

const INTERVIEW_TYPES = ['All', 'Behavioral', 'Technical', 'HR'];
const DATE_RANGES = ['All Time', 'This Week', 'This Month'];

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRange, setSelectedRange] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function fetchSessions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('created_at', { ascending: false });
        setSessions(data || []);
        setFilteredSessions(data || []);
      }
      setLoading(false);
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    let filtered = [...sessions];

    if (selectedType !== 'All') {
      filtered = filtered.filter(s => s.interview_type.toLowerCase() === selectedType.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.interview_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRange !== 'All Time') {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      if (selectedRange === 'This Week') {
        filtered = filtered.filter(s => new Date(s.created_at) >= oneWeekAgo);
      } else if (selectedRange === 'This Month') {
        filtered = filtered.filter(s => new Date(s.created_at) >= oneMonthAgo);
      }
    }

    setFilteredSessions(filtered);
  }, [selectedType, selectedRange, searchQuery, sessions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Interview History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Review your past sessions and track your growth.</p>
        </div>
        <Link 
          href="/interview/setup"
          className="px-6 py-3 bg-accent text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-accent/20"
        >
          <Plus size={18} /> New Session
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[32px] p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by role or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl outline-none focus:border-accent/50 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-1 rounded-2xl border border-slate-100 dark:border-white/5">
            {INTERVIEW_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedType === type 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-1 rounded-2xl border border-slate-100 dark:border-white/5">
            {DATE_RANGES.map(range => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRange === range 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Link
              href={`/history/${session.id}`}
              key={session.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-accent/50 transition-all shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                    {session.role}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <Calendar size={12} /> {new Date(session.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <Target size={12} /> {session.interview_type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{Math.round(session.total_score || 0)}%</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Score</p>
                </div>
                <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                  <ChevronRight size={24} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-32 text-center rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-6">
              <History size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {searchQuery || selectedType !== 'All' || selectedRange !== 'All Time' ? 'No matching sessions' : 'No history yet'}
            </h3>
            <p className="text-slate-500 mt-2 mb-10 max-w-sm mx-auto">
              {searchQuery || selectedType !== 'All' || selectedRange !== 'All Time' 
                ? 'Try adjusting your filters to find what you looking for.' 
                : "You haven't completed any interview sessions yet. Start your first one to see your history here!"}
            </p>
            {!searchQuery && selectedType === 'All' && selectedRange === 'All Time' && (
              <Link 
                href="/interview/setup"
                className="px-8 py-4 bg-accent text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-accent/20 mx-auto w-fit"
              >
                Start Your First Session <ArrowRight size={20} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
