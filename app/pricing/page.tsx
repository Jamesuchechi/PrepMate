import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function PricingPage() {
  return (
    <InfoPageLayout 
      title="Pricing Plans" 
      subtitle="Simple, transparent pricing for students at every stage of their job search."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-12">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="ml-1 text-slate-500">/forever</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-3">✅ 3 sessions per month</li>
            <li className="flex items-center gap-3">✅ Standard Question Bank</li>
            <li className="flex items-center gap-3">✅ Basic AI Feedback</li>
            <li className="flex items-center gap-3">❌ History & Analytics</li>
          </ul>
          <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:opacity-80 transition-all">
            Get Started
          </button>
        </div>

        <div className="p-8 rounded-3xl border-2 border-accent bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl">
            Popular
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Plan</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$12</span>
              <span className="ml-1 text-slate-500">/month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-3">✅ Unlimited sessions</li>
            <li className="flex items-center gap-3">✅ Premium AI Models</li>
            <li className="flex items-center gap-3">✅ Full Analytics Dashboard</li>
            <li className="flex items-center gap-3">✅ Export Session History</li>
          </ul>
          <button className="w-full py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:opacity-90 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="text-center bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xl font-bold mb-2">University Partner?</h4>
        <p className="text-slate-600 dark:text-slate-400">We offer white-label solutions and bulk licenses for career centers. <a href="/contact" className="text-accent font-bold">Contact our sales team</a>.</p>
      </div>
    </InfoPageLayout>
  );
}
