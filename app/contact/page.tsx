import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function ContactPage() {
  return (
    <InfoPageLayout 
      title="Contact Us" 
      subtitle="Have a question or feedback? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose">
        <div>
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Get in Touch</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Whether you're a student with a question, a university looking to partner, or just want to say hi, our team is here to help.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl">📧</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Email</h4>
                <p className="text-slate-500">support@prepmate.ai</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl">📍</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Location</h4>
                <p className="text-slate-500">Remote / London, UK</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl">🐦</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Twitter</h4>
                <p className="text-slate-500">@PrepMateAI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-accent" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-accent" placeholder="name@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-accent" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </InfoPageLayout>
  );
}
