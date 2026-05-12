export default function InterviewSessionPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Interview Session</h1>
      <p className="text-slate-400">Live interview session: {params.id}</p>
    </div>
  );
}
