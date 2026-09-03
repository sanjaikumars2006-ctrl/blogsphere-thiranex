import React from 'react';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col h-full">
      <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-6 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5" />
          <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const BlogDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4" />
      <div className="h-10 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4" />
      <div className="h-6 w-3/5 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>

      <div className="w-full h-80 sm:h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-10" />

      <div className="space-y-4">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-8 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mt-6 mb-3" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
};
