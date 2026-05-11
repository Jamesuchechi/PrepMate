import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function CareersPage() {
  const jobs = [
    { title: "Senior AI Engineer", location: "Remote / London", type: "Full-time" },
    { title: "Frontend Developer (React/Next.js)", location: "Remote / Lagos", type: "Full-time" },
    { title: "Product Designer", location: "Remote / New York", type: "Full-time" },
    { title: "Customer Success Lead", location: "Remote", type: "Full-time" }
  ];

  return (
    <InfoPageLayout 
      title="Join the Nexa Team" 
      subtitle="Help us build the future of education and career development."
    >
      <div className="space-y-12">
        <section>
          <h2>Why work at Nexa?</h2>
          <p>
            We are a small, highly ambitious team of engineers, designers, and educators. We value extreme ownership, rapid iteration, and a deep commitment to the students we serve.
          </p>
        </section>

        <section className="not-prose">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Open Positions</h3>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-accent transition-colors cursor-pointer group">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">{job.title}</h4>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-all whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Perks & Benefits</h2>
          <ul>
            <li><strong>Remote-First:</strong> Work from anywhere in the world.</li>
            <li><strong>Learning Budget:</strong> $2,000 yearly for books, courses, and conferences.</li>
            <li><strong>Equity:</strong> Every employee is an owner of the company.</li>
            <li><strong>Health:</strong> Comprehensive global health insurance.</li>
          </ul>
        </section>
      </div>
    </InfoPageLayout>
  );
}
