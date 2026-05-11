import React from 'react';
import Link from 'next/link';

export default function InfoPageLayout({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode 
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Prep<span className="text-accent">Mate</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-accent transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto prose dark:prose-invert prose-slate prose-lg">
          {children}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            © 2026 PrepMate by Nexa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-accent">Privacy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-accent">Terms</Link>
            <Link href="/contact" className="text-sm text-slate-500 hover:text-accent">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
