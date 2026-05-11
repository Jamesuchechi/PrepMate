import InfoPageLayout from "@/components/layout/InfoPageLayout";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "How to use the STAR method for behavioral interviews",
      excerpt: "The Situation, Task, Action, and Result framework is the gold standard for answering behavioral questions...",
      date: "May 10, 2026",
      readTime: "5 min read",
      category: "Preparation"
    },
    {
      title: "Top 10 Software Engineering interview questions in 2026",
      excerpt: "From system design to core algorithms, here's what top tech firms are asking this year...",
      date: "May 5, 2026",
      readTime: "8 min read",
      category: "Tech"
    },
    {
      title: "Overcoming interview anxiety: 3 AI-backed strategies",
      excerpt: "How repeated practice with an AI coach can physically lower your stress response during real interviews...",
      date: "April 28, 2026",
      readTime: "6 min read",
      category: "Mindset"
    }
  ];

  return (
    <InfoPageLayout 
      title="PrepMate Blog" 
      subtitle="Expert insights, interview tips, and product updates from our team."
    >
      <div className="space-y-12 not-prose">
        {posts.map((post, i) => (
          <article key={i} className="group border-b border-slate-100 dark:border-slate-800 pb-12 last:border-0">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span>{post.date}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{post.category}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors cursor-pointer mb-4 leading-tight">
              {post.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <Link href="#" className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Read More <span>→</span>
            </Link>
          </article>
        ))}
      </div>
    </InfoPageLayout>
  );
}
