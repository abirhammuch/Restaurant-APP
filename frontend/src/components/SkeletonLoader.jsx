import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white p-6 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] bg-white/90 p-6 shadow-lg shadow-orange-100/40">
          <div className="mb-6 flex flex-col gap-4">
            <div className="h-8 w-1/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-[32px] border border-slate-200 bg-slate-100 p-5 shadow-sm"
              >
                <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
                <div className="mt-5 space-y-3">
                  <div className="h-5 w-5/6 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-10 w-20 animate-pulse rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-orange-100/20"
            >
              <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-6 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
