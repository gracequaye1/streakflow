export default function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2" />
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex gap-5 mt-4">
        {[1,2,3].map(i => (
          <div key={i}>
            <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-10 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 flex-wrap mt-3">
        {Array.from({length: 30}).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}