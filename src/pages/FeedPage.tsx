import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  X,
  ArrowUpDown,
  Tag,
  Compass,
  FilterX,
} from 'lucide-react';
import { Post } from '../types/index.js';
import { BlogCard } from '../components/BlogCard.js';
import { BlogCardSkeleton } from '../components/SkeletonLoader.js';

export const FeedPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const categoryParam = searchParams.get('category') || 'All';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = (searchParams.get('sort') as 'newest' | 'popular' | 'oldest') || 'newest';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [availableTags, setAvailableTags] = useState<{ name: string; count: number }[]>([]);

  const categories = [
    'All',
    'Technology',
    'AI',
    'Web Development',
    'Design',
    'Career',
    'Programming',
  ];

  // Fetch posts from API based on query params
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('status', 'published');
        if (categoryParam && categoryParam !== 'All') query.set('category', categoryParam);
        if (tagParam) query.set('tag', tagParam);
        if (searchParam) query.set('search', searchParam);
        if (sortParam) query.set('sort', sortParam);

        const res = await fetch(`/api/posts?${query.toString()}`);
        const data = await res.json();
        if (data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryParam, tagParam, searchParam, sortParam]);

  // Fetch tags for tag cloud
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        if (data.tags) {
          setAvailableTags(data.tags);
        }
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    };
    fetchTags();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('search', searchInput.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleCategoryChange = (category: string) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') {
      next.delete('category');
    } else {
      next.set('category', category);
    }
    setSearchParams(next);
  };

  const handleTagToggle = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    if (tagParam === tag) {
      next.delete('tag');
    } else {
      next.set('tag', tag);
    }
    setSearchParams(next);
  };

  const handleSortChange = (sort: 'newest' | 'popular' | 'oldest') => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sort);
    setSearchParams(next);
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = categoryParam !== 'All' || !!tagParam || !!searchParam || sortParam !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Discover & Learn</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Explore All Stories
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Read in-depth technical essays, engineering playbooks, and architectural reflections.
          </p>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="appearance-none pl-9 pr-8 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Grid/List Layout Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search stories by title, content, author or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = categoryParam === cat || (cat === 'All' && !searchParams.get('category'));
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 scale-102'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Tags Row */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags:
            </span>
            {availableTags.slice(0, 10).map((t) => {
              const isSelected = tagParam.toLowerCase() === t.name.toLowerCase();
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => handleTagToggle(t.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  #{t.name} ({t.count})
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="text-zinc-500 font-medium">Active filters:</span>
            {categoryParam !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold">
                Category: {categoryParam}
                <button onClick={() => handleCategoryChange('All')}>
                  <X className="w-3 h-3 hover:text-indigo-900" />
                </button>
              </span>
            )}
            {tagParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-semibold">
                Tag: #{tagParam}
                <button onClick={() => handleTagToggle(tagParam)}>
                  <X className="w-3 h-3 hover:text-purple-900" />
                </button>
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold">
                Query: "{searchParam}"
                <button onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('search');
                  setSearchInput('');
                  setSearchParams(next);
                }}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Posts Results */}
      {loading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <BlogCardSkeleton key={n} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <FilterX className="w-12 h-12 text-zinc-400 mx-auto mb-3 opacity-70" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            No matching stories found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            We couldn't find any articles matching your search filters. Try adjusting your keyword or category.
          </p>
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} layout={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};
