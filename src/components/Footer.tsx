import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Feather className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                BlogSphere
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A modern publishing platform where ideas become conversations. Empowering writers, developers, and thinkers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/feed" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Stories
                </Link>
              </li>
              <li>
                <Link to="/feed?category=Technology" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Technology & Architecture
                </Link>
              </li>
              <li>
                <Link to="/feed?category=AI" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/feed?category=Design" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Design & UI/UX
                </Link>
              </li>
            </ul>
          </div>

          {/* Writers & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              For Authors
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/create" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Start Writing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Author Analytics
                </Link>
              </li>
              <li>
                <Link to="/my-blogs" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Manage Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Stay Inspired
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Get the best articles and curated technical essays delivered weekly.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} BlogSphere Platform. Developed for Thiranex Internship Evaluation.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Express & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
