import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function AboutPage() {
  return (
    <InfoPageLayout 
      title="About PrepMate" 
      subtitle="We're on a mission to democratize elite interview coaching for every student, everywhere."
    >
      <div className="space-y-8">
        <section>
          <h2>The PrepMate Story</h2>
          <p>
            PrepMate was born out of a simple observation: the gap between landing an interview and landing a job is often just access to quality feedback. While elite candidates have access to expensive coaches and extensive networks, most students are left to practice in front of a mirror.
          </p>
          <p>
            At Nexa Hack 2026, we decided to change that. By combining advanced AI with proven interview frameworks (like STAR), we've built a platform that acts as a 24/7, infinitely patient, and ruthlessly honest interview coach.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400">To be the global standard for interview preparation, helping 10 million students land their dream roles by 2030.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-2">Our Values</h3>
            <p className="text-slate-600 dark:text-slate-400">Transparency, meritocracy, and obsessive focus on student outcomes. We don't just help you practice; we help you improve.</p>
          </div>
        </section>

        <section>
          <h2>Why PrepMate?</h2>
          <ul>
            <li><strong>AI-First:</strong> Our core engine is powered by specialized models trained on thousands of successful interview transcripts.</li>
            <li><strong>Data-Driven:</strong> We don't just tell you "good job." we score your answers across four distinct cognitive dimensions.</li>
            <li><strong>Habit-Building:</strong> With our streak system and progress tracking, we turn interview prep from a chore into a habit.</li>
          </ul>
        </section>
      </div>
    </InfoPageLayout>
  );
}
