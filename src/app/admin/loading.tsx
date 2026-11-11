export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white p-6 rounded-2xl border border-slate-border flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-slate-bg" />
          <div className="h-7 w-56 rounded-lg bg-slate-bg" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-slate-bg" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-border space-y-3"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-bg" />
            <div className="h-7 w-16 rounded bg-slate-bg" />
            <div className="h-3 w-28 rounded bg-slate-bg" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-border p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r} className="h-12 w-full rounded-xl bg-slate-bg" />
        ))}
      </div>
    </div>
  );
}
