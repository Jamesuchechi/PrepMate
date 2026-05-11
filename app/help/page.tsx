import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function HelpPage() {
  const faqs = [
    { 
      q: "How does the AI evaluation work?", 
      a: "Our system uses specialized language models to analyze your text based on key communication pillars. It looks for specific structural markers (like the STAR method) and evaluates the clarity and relevance of your examples." 
    },
    { 
      q: "Can I use PrepMate on my mobile phone?", 
      a: "Yes! PrepMate is fully responsive and works beautifully on any mobile browser. You can practice on the go." 
    },
    { 
      q: "What roles are supported?", 
      a: "We currently support over 20+ major industries including Software Engineering, Product Management, UX Design, Marketing, Finance, and more. If your role isn't listed, you can use the 'General' mode." 
    },
    { 
      q: "Is my data private?", 
      a: "Absolutely. We use Supabase's Row Level Security to ensure that only you can ever access your interview history and scores. We do not sell your data to third parties." 
    }
  ];

  return (
    <InfoPageLayout 
      title="Help Center" 
      subtitle="Find answers to common questions or reach out to our support team."
    >
      <div className="space-y-12">
        <section className="not-prose">
          <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{faq.q}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-slate-100 dark:bg-slate-900/50 p-10 rounded-3xl not-prose border border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Still have questions?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a href="/contact" className="inline-block px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all">
            Contact Support
          </a>
        </section>
      </div>
    </InfoPageLayout>
  );
}
