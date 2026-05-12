export default function SessionDetailPage({ params }: { params: { session_id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Session Detail</h1>
      <p className="text-slate-400">Viewing details for session: {params.session_id}</p>
    </div>
  );
}
