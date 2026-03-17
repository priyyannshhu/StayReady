interface PropertySkeletonProps { count?: number; }

export const PropertySkeleton: React.FC<PropertySkeletonProps> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="skeleton w-full rounded-xl" style={{ aspectRatio: '4/3' }} />
        <div className="space-y-2 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="skeleton h-3.5 w-3/5 rounded" />
            <div className="skeleton h-3.5 w-8 rounded" />
          </div>
          <div className="skeleton h-3 w-2/5 rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
          <div className="skeleton h-3.5 w-1/3 rounded mt-1" />
        </div>
      </div>
    ))}
  </div>
);

interface EmptyStateProps { message?: string; onClear?: () => void; }

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No properties found',
  onClear,
}) => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="w-20 h-20 rounded-full bg-[#f7f7f7] border border-[#e0e0e0] flex items-center justify-center mb-6">
      <svg className="w-9 h-9 text-[#717171]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </div>
    <h3 className="font-display font-700 text-xl text-[#1a1a1a] mb-2">{message}</h3>
    <p className="text-[#717171] text-sm max-w-xs leading-relaxed">
      Try adjusting your filters or search for a different destination.
    </p>
    {onClear && (
      <button
        onClick={onClear}
        className="mt-6 px-6 py-3 border border-[#1a1a1a] rounded-xl text-sm font-display font-600 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-150"
      >
        Clear filters
      </button>
    )}
  </div>
);
