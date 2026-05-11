import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function ApiDocsPage() {
  return (
    <InfoPageLayout 
      title="API Reference" 
      subtitle="Build your own interview prep tools using the PrepMate engine."
    >
      <div className="space-y-12">
        <section>
          <h2>Authentication</h2>
          <p>
            All API requests must include your API key in the <code>Authorization</code> header:
          </p>
          <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-x-auto">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </section>

        <section>
          <h2>Endpoints</h2>
          
          <div className="space-y-8 not-prose">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500 text-white font-bold rounded-lg text-xs uppercase">POST</span>
                <code className="text-slate-900 dark:text-white font-bold">/v1/generate-question</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">Generates a contextual interview question.</p>
                <h5 className="font-bold mb-2 text-sm text-slate-500 uppercase tracking-widest">Parameters</h5>
                <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                  <li><code>role</code> (string): Target job role</li>
                  <li><code>level</code> (string): entry | mid | senior</li>
                  <li><code>type</code> (string): behavioral | technical | hr</li>
                </ul>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500 text-white font-bold rounded-lg text-xs uppercase">POST</span>
                <code className="text-slate-900 dark:text-white font-bold">/v1/evaluate-answer</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">Evaluates an answer and returns multi-dimensional scores.</p>
                <h5 className="font-bold mb-2 text-sm text-slate-500 uppercase tracking-widest">Parameters</h5>
                <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                  <li><code>question</code> (string): The question asked</li>
                  <li><code>answer</code> (string): The candidate's response</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
