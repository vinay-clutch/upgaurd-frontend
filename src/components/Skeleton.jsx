export const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const WebsiteCardSkeleton = () => (
  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-3 w-full">
        <SkeletonPulse className="h-3 w-3 rounded-full" />
        <SkeletonPulse className="h-4 w-40" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <SkeletonPulse className="h-2 w-10 mb-2" />
        <SkeletonPulse className="h-6 w-16" />
      </div>
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <SkeletonPulse className="h-2 w-10 mb-2" />
        <SkeletonPulse className="h-6 w-16" />
      </div>
    </div>
    <div className="mt-6 flex justify-between">
      <SkeletonPulse className="h-3 w-20" />
      <SkeletonPulse className="h-3 w-10" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div>
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <SkeletonPulse className="h-2 w-12 mb-2" />
          <SkeletonPulse className="h-8 w-16" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <WebsiteCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
