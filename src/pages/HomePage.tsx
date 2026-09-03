import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Compass,
  PenSquare,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  ShieldCheck,
  MessageSquareHeart,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { Post } from '../types/index.js';
import { BlogCard } from '../components/BlogCard.js';
import { BlogCardSkeleton } from '../components/SkeletonLoader.js';

export const HomePage: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?status=published');
        const data = await res.json();
        if (data.posts) {
          setFeaturedPosts(data.posts.slice(0, 2));
          setRecentPosts(data.posts.slice(2, 6));
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = [
    {
      name: 'Technology',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-600',
      description: 'System design, cloud architecture & modern tech stacks',
    },
    {
      name: 'AI',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      description: 'Autonomous agents, LLM prompting & neural networks',
    },
    {
      name: 'Web Development',
      icon: Layers,
      color: 'from-cyan-500 to-teal-600',
      description: 'React 19, Tailwind CSS, frontend optimization & web APIs',
    },
    {
      name: 'Design',
      icon: MessageSquareHeart,
      color: 'from-pink-500 to-rose-600',
      description: 'UI/UX psychology, tactile motion & design systems',
    },
    {
      name: 'Career',
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      description: 'Senior engineering roadmaps, leadership & mentoring',
    },
    {
      name: 'Programming',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      description: 'Clean code principles, algorithms & backend craft',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Animated Background Gradients & Floating Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-cyan-400/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Floating Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-xs mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Next-Gen Publishing Ecosystem</span>
          </motion.div>

          {/* Main Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] sm:leading-[1.15]"
          >
            Share Your Stories.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Inspire the World.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A modern blogging platform where ideas become conversations. Discover insightful stories, share your technical expertise, and connect with creative thinkers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/feed"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold text-base shadow-sm active:scale-95 transition-all"
            >
              <PenSquare className="w-5 h-5 text-indigo-500" />
              <span>Start Writing</span>
            </Link>
          </motion.div>

          {/* Floating Pill Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-3"
          >
            {['✨ Markdown Support', '⚡ Instant Feedback', '💬 Threaded Comments', '📊 Live Analytics', '🛡️ Type-Safe Architecture'].map((item) => (
              <span
                key={item}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          {[
            { label: 'Active Writers', value: '4,800+', icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Published Stories', value: '18,500+', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Monthly Readers', value: '120k+', icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Community Rating', value: '99.4%', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center p-3 sm:p-4">
                <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-3 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured / Spotlight Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Editor's Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Featured Articles
            </h2>
          </div>
          <Link
            to="/feed"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} layout="list" featured={true} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Curated Domains
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
            Explore Topics You Care About
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Dive into specialized streams crafted by engineering leaders and industry practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/feed?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Stories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Fresh Off The Press
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
              Latest Publications
            </h2>
          </div>
          <Link
            to="/feed"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <BlogCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} layout="grid" />
            ))}
          </div>
        )}
      </section>

      {/* Platform Features / Value Prop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Built for Developers & Thinkers</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to publish your ideas to a global audience?
            </h2>
            <p className="mt-4 text-zinc-300 text-base leading-relaxed">
              Experience distraction-free writing, rich markdown styling, threaded conversations, and instant audience engagement.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/create"
                className="px-7 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 active:scale-95 transition-all shadow-lg"
              >
                Start Writing Now
              </Link>
              <Link
                to="/feed"
                className="px-7 py-3.5 rounded-full bg-indigo-800/60 hover:bg-indigo-800 text-white border border-indigo-400/30 font-bold text-sm transition-all"
              >
                Read Community Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
