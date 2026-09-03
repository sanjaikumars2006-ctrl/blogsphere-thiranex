import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Clock,
  Heart,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Post } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

interface BlogCardProps {
  post: Post;
  layout?: 'grid' | 'list';
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  layout = 'grid',
  featured = false,
}) => {
  const { user, isAuthenticated, toggleBookmark } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const isLikedInitially = user ? post.likes?.includes(user.id) : false;
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(isLikedInitially);
  const [isLiking, setIsLiking] = useState(false);

  const isBookmarked = user ? user.bookmarks?.includes(post.id) : false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      error('Please log in to like this story.');
      navigate('/login');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
      });

      if (!res.ok) {
        // Revert on error
        setIsLiked(!nextLiked);
        setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (err) {
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(post.id);
  };

  const categoryColors: Record<string, string> = {
    Technology: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    AI: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    Design: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    Career: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Programming: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'Web Development': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  };

  const badgeStyle =
    categoryColors[post.category] ||
    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row gap-6 p-4 sm:p-5"
      >
        <div className="relative sm:w-64 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${badgeStyle}`}
            >
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>{formattedDate}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <Link to={`/post/${post.slug || post.id}`}>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
            </Link>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              to={`/author/${post.authorId}`}
              className="flex items-center gap-2.5 group/author"
            >
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover/author:text-indigo-600 dark:group-hover/author:text-indigo-400 transition-colors">
                {post.author.name}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isLiked
                    ? 'text-rose-500'
                    : 'text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform active:scale-125 ${
                    isLiked ? 'fill-rose-500' : ''
                  }`}
                />
                <span>{likesCount}</span>
              </button>

              <button
                type="button"
                onClick={handleBookmark}
                className={`p-1 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                aria-label="Bookmark post"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''
                  }`}
                />
              </button>

              <Link
                to={`/post/${post.slug || post.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid Layout
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col h-full ${
        featured ? 'ring-2 ring-indigo-500/20 shadow-indigo-500/5' : ''
      }`}
    >
      <div className="relative w-full h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${badgeStyle}`}
          >
            {post.category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}m read</span>
            </div>
          </div>

          <Link to={`/post/${post.slug || post.id}`}>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <Link
            to={`/author/${post.authorId}`}
            className="flex items-center gap-2 group/author max-w-[130px]"
          >
            <img
              src={post.author.profileImage}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate group-hover/author:text-indigo-600 dark:group-hover/author:text-indigo-400 transition-colors">
              {post.author.name}
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                isLiked
                  ? 'text-rose-500'
                  : 'text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                  isLiked ? 'fill-rose-500' : ''
                }`}
              />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1 rounded transition-colors ${
                isBookmarked
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''
                }`}
              />
            </button>

            <Link
              to={`/post/${post.slug || post.id}`}
              className="p-1 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
              aria-label="Read full story"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
