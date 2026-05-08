export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="aspect-[3/4] skeleton-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 skeleton-pulse bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
        <div className="h-3   skeleton-pulse bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
        <div className="h-4   skeleton-pulse bg-slate-200 dark:bg-slate-700 rounded-full w-1/4 mt-4" />
      </div>
    </div>
  );
}

export function SkeletonText({ className = 'h-4 w-full' }) {
  return <div className={`skeleton-pulse bg-slate-200 dark:bg-slate-700 rounded-full ${className}`} />;
}

export default SkeletonCard;
