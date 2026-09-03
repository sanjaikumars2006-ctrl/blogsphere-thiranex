import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import {
  Clock,
  Calendar,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  Sparkles,
  User,
} from 'lucide-react';
import { Post, Comment } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { BlogDetailSkeleton } from '../components/SkeletonLoader.js';
import { CommentSection } from '../components/CommentSection.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleBookmark } = useAuth();
  const { success, error } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch post details & comments
  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const [postRes, commentRes] = await Promise.all([
          fetch(`/api/posts/${id}?incViews=true`),
          fetch(`/api/posts/${id}/comments`),
        ]);

        if (!postRes.ok) {
          error('Article not found');
          setLoadError(true);
          return;
        }

        const postData = await postRes.json();
        const commentData = await commentRes.json();

        setPost(postData.post);
        setComments(commentData.comments || []);
        setLikesCount(postData.post.likes?.length || 0);
        setIsLiked(user ? postData.post.likes?.includes(user.id) : false);
      } catch (err) {
        console.error('Failed to load article details:', err);
        error('Error loading article');
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      error('Please sign in to like this story');
      navigate('/login');
      return;
    }

    if (!post) return;

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
        setIsLiked(!nextLiked);
        setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (err) {
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Story link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
      });

      if (res.ok) {
        success('Post deleted successfully');
        navigate('/my-blogs');
      } else {
        error('Failed to delete post');
      }
    } catch (err) {
      error('Network error deleting post');
    }
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {loadError ? 'Unable to load this story' : 'Story not found'}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          The article could not be displayed right now.
        </p>
        <button
          type="button"
          onClick={() => navigate('/feed')}
          className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to stories
        </button>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.authorId || user.role === 'admin');
  const isBookmarked = user ? user.bookmarks?.includes(post.id) : false;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative min-h-screen pb-24">
      {/* Fixed Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to stories</span>
          </button>

          {/* Author Controls if Owner */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Story</span>
              </Link>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Pill & Title */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80">
              {post.category}
            </span>
            {post.status === 'draft' && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Draft Preview
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        </div>

        {/* Author Header Row */}
        <div className="flex items-center justify-between py-6 border-y border-zinc-200/80 dark:border-zinc-800 mb-10">
          <Link
            to={`/author/${post.authorId}`}
            className="flex items-center gap-3.5 group"
          >
            <img
              src={post.author.profileImage}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-all"
            />
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.author.name}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-1">{post.author.bio || 'Author on BlogSphere'}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative w-full h-[320px] sm:h-[480px] rounded-3xl overflow-hidden mb-12 shadow-xl border border-zinc-200/60 dark:border-zinc-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Rendered via Markdown */}
        <div className="prose prose-zinc dark:prose-invert max-w-none mb-14 text-zinc-800 dark:text-zinc-200 leading-relaxed text-base sm:text-lg">
          <Markdown>{post.content}</Markdown>
        </div>

        {/* Tags Footnote */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-zinc-200/80 dark:border-zinc-800 mb-12">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-2">
            Tags:
          </span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/feed?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Sticky Interaction Bar */}
        <div className="sticky bottom-6 z-30 flex items-center justify-center pointer-events-none mb-12">
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-zinc-200/80 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

            <button
              type="button"
              onClick={() => toggleBookmark(post.id)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="Bookmark story"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('comments-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>

            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Author Bio Spotlight Card */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-cyan-50/70 dark:from-zinc-900 dark:via-indigo-950/30 dark:to-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 mb-14 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={post.author.profileImage}
            alt={post.author.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Written by
            </span>
            <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
              {post.author.name}
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              {post.author.bio || 'Contributing author and technical writer on BlogSphere.'}
            </p>
            <div className="mt-4">
              <Link
                to={`/author/${post.authorId}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>View all stories by {post.author.name}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Threaded Comments Section */}
        <CommentSection
          postId={post.id}
          comments={comments}
          onCommentAdded={(newComment) => setComments((prev) => [newComment, ...prev])}
          onCommentUpdated={(updated) =>
            setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
          }
          onCommentDeleted={(deletedId) =>
            setComments((prev) => prev.filter((c) => c.id !== deletedId && c.parentId !== deletedId))
          }
        />
      </article>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story? This action cannot be undone and will also remove all comments."
        confirmLabel="Delete Story"
        isDestructive={true}
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
