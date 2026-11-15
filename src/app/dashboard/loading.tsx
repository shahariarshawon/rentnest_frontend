export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Greeting Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="w-10 h-10 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main Table / Content Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="h-6 w-36 bg-slate-200 rounded-md" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
