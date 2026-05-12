export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-pulse">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-4 w-48 bg-slate-100 dark:bg-white/5 rounded-lg" />
        </div>
        <div className="h-14 w-44 bg-slate-200 dark:bg-white/5 rounded-2xl" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[32px]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px]" />
            <div className="h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px]" />
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          <div className="h-64 bg-slate-900 rounded-[40px]" />
          <div className="h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[40px]" />
        </div>
      </div>
    </div>
  );
}
