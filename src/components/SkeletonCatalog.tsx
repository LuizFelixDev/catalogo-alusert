import React from 'react';

export const SkeletonCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full skeleton" />
              <div className="space-y-1.5">
                <div className="w-32 h-5 skeleton rounded-md" />
                <div className="w-48 h-3.5 skeleton rounded-md" />
              </div>
            </div>
            <div className="w-28 h-10 skeleton rounded-xl" />
          </div>
          <div className="w-full h-10 skeleton rounded-xl mt-2" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 flex flex-col"
            >
              <div className="w-full aspect-square skeleton rounded-xl" />
              <div className="w-3/4 h-4 skeleton rounded-md" />
              <div className="w-1/2 h-3 skeleton rounded-md" />
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="w-20 h-6 skeleton rounded-md" />
                <div className="w-16 h-8 skeleton rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
