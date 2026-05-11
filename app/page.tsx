import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Prep<span className="text-accent">Mate</span> 🎯
        </h1>
        <p className="text-xl md:text-2xl text-slate-400">
          The AI-powered interview coach that gives you brutally honest feedback so you can walk into every interview with total confidence.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-all text-lg w-full md:w-auto"
          >
            Start Practicing Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 border border-slate-700 font-bold rounded-lg hover:bg-slate-800 transition-all text-lg w-full md:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">Role-Specific Prep</h3>
          <p className="text-slate-400">Contextual questions generated for Software Engineering, Product, Data, and 20+ other roles.</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="text-xl font-bold mb-2">Measurable Growth</h3>
          <p className="text-slate-400">Track your progress across Clarity, Confidence, Structure, and Relevance with visual dashboards.</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
          <p className="text-slate-400">Get detailed scores and actionable improvement tips within seconds of submitting your answer.</p>
        </div>
      </div>
    </main>
  );
}
