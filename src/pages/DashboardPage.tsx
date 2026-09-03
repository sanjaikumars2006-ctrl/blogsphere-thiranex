import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BookOpen,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  PenSquare,
  FileCheck,
  FileClock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { DashboardStats } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const DashboardPage: React.FC = () => {
  const { token, user } = useAuth();
  const { error } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/stats/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          error('Failed to load dashboard data');
        }
      } catch (err) {
        error('Network error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-500 font-medium">Computing author analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-zinc-500">Unable to load dashboard.</p>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/60 dark:border-indigo-800/60',
    },
    {
      label: 'Published',
      value: stats.publishedCount,
      icon: FileCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-800/60',
    },
    {
      label: 'Drafts',
      value: stats.draftCount,
      icon: FileClock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-800/60',
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200/60 dark:border-cyan-800/60',
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200/60 dark:border-rose-800/60',
    },
    {
      label: 'Comments',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200/60 dark:border-purple-800/60',
    },
  ];

  const PIE_COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Author Performance</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Welcome back, {user?.name}. Here is a summary of how your writing is performing.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PenSquare className="w-4 h-4" />
          <span>Write Story</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 sm:p-5 rounded-2xl border ${card.bg} shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Reader Traffic & Engagement
              </h3>
              <p className="text-xs text-zinc-400">Monthly readership & likes trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Last 5 Months
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyViews}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  name="Likes"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#likesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-zinc-400">Story count by domain</p>
          </div>

          {stats.categoryBreakdown.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.category || entry.name} (${entry.count || entry.value})`}
                  >
                    {stats.categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400">
              No published stories in categories yet.
            </div>
          )}

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            Keep writing across diverse topics to expand reach.
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Comments & Top Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Comments Received */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Recent Reader Comments
            </h3>
            <span className="text-xs text-zinc-400">Live feed</span>
          </div>

          {stats.recentComments.length === 0 ? (
            <p className="py-8 text-center text-xs text-zinc-400">
              No reader comments received yet.
            </p>
          ) : (
            <div className="space-y-3.5">
              {stats.recentComments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.authorImage}
                        alt={c.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {c.authorName}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">"{c.content}"</p>
                  <Link
                    to={`/post/${c.postId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                  >
                    <span>On: {c.postTitle}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Author Shortcuts & Stories */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Recent Stories
            </h3>
            <Link
              to="/my-blogs"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentPosts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[11px] text-zinc-400">{p.category}</span>
                  </div>
                  <Link
                    to={`/post/${p.slug || p.id}`}
                    className="text-xs font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                  >
                    {p.title}
                  </Link>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{p.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{p.likes?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
