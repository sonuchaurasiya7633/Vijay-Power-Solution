export default function PublicLoading() {
  return (
    <div className="bg-white animate-pulse">
      {/* Page Hero Skeleton */}
      <div className="bg-navy-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-6 w-44 rounded-full bg-white/10" />
          <div className="h-10 w-3/4 max-w-xl rounded-xl bg-white/15" />
          <div className="h-4 w-2/3 max-w-2xl rounded-lg bg-white/10" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-border bg-white overflow-hidden"
            >
              <div className="h-48 w-full bg-slate-bg" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 rounded bg-slate-bg" />
                <div className="h-6 w-3/4 rounded bg-slate-bg" />
                <div className="h-4 w-full rounded bg-slate-bg" />
                <div className="h-10 w-full rounded-xl bg-slate-bg mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
