import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Home, Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-200/80 dark:border-zinc-800 shadow-xl space-y-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div>
          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-2">
            Story Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            The page or story you are looking for might have been moved, deleted, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/feed"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Feed</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
