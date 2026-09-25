import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-800/80 ${className}`}
      aria-hidden="true"
    />
  );
};

export const InvestigationSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Question skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 bg-neutral-800" />
        <Skeleton className="h-8 w-3/4 bg-neutral-800" />
      </div>

      {/* Conclusion box skeleton */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0c0c0c] space-y-3 shadow-xl shadow-black">
        <Skeleton className="h-5 w-32 bg-neutral-800" />
        <Skeleton className="h-4 w-full bg-neutral-800/70" />
        <Skeleton className="h-4 w-5/6 bg-neutral-800/70" />
        <Skeleton className="h-4 w-4/6 bg-neutral-800/70" />
      </div>

      {/* Key findings skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40 bg-neutral-800" />
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-neutral-800 bg-black space-y-2">
            <Skeleton className="h-4 w-full bg-neutral-800/70" />
            <Skeleton className="h-3 w-1/4 bg-neutral-800/70" />
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-black space-y-2">
            <Skeleton className="h-4 w-11/12 bg-neutral-800/70" />
            <Skeleton className="h-3 w-1/3 bg-neutral-800/70" />
          </div>
        </div>
      </div>
    </div>
  );
};
