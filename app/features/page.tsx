import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function FeaturesPage() {
  return (
    <InfoPageLayout 
      title="Platform Features" 
      subtitle="Discover the tools we've built to transform your interview performance from average to elite."
    >
      <div className="space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center not-prose">
          <div>
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-4">Contextual Question Engine</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our AI doesn't just pull from a static list. It generates unique, role-specific questions based on your target position, experience level, and the specific interview type (Behavioral, Technical, or HR).
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 aspect-video rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
             <span className="text-slate-400 font-mono text-sm">[Question Preview Mockup]</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center not-prose">
          <div className="md:order-2">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4">Multi-Dimensional Scoring</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Every answer is evaluated across four critical pillars: **Clarity, Confidence, Structure, and Relevance**. Get a weighted overall score and see exactly where your communication is breaking down.
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 aspect-video rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 md:order-1">
             <span className="text-slate-400 font-mono text-sm">[Radar Chart Mockup]</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center not-prose">
          <div>
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold mb-4">Actionable Feedback</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Beyond the scores, you get a detailed analytical paragraph explaining your strengths and a single, high-impact **Improvement Tip** to focus on for your next session.
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 aspect-video rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
             <span className="text-slate-400 font-mono text-sm">[Feedback Card Mockup]</span>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
