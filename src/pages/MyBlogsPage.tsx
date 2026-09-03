import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  PenSquare,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Trash2,
  Edit,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Post } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { ConfirmModal } from '../components/ConfirmModal.js';

export const MyBlogsPage: React.FC = () => {
  const { user, token } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchMyPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?authorId=${user.id}&status=all`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      error('Failed to load your stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      const res = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        success('Story deleted successfully');
      } else {
        error('Failed to delete story');
      }
    } catch (err) {
      error('Network error deleting story');
    } finally {
      setPostToDelete(null);
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p))
        );
        success(`Story set to ${nextStatus}`);
      }
    } catch (err) {
      error('Failed to toggle status');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (tab !== 'all' && p.status !== tab) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Story Management</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            My Stories ({posts.length})
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your drafts, review published performance, and update content.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PenSquare className="w-4 h-4" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'all'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('published')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'published'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('draft')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'draft'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Filter your stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stories List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-500">Loading your stories...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <BookOpen className="w-12 h-12 text-zinc-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            No stories found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
            {searchTerm
              ? "No stories match your filter criteria."
              : tab === 'draft'
              ? "You don't have any drafts saved."
              : "You haven't published any stories yet."}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Create a Story</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">{post.category}</span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">{formattedDate}</span>
                      </div>

                      <Link to={`/post/${post.slug || post.id}`}>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-zinc-500 line-clamp-1 mt-1 max-w-xl">
                        {post.excerpt}
                      </p>

                      {/* Performance metrics */}
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mt-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{post.likes?.length || 0} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(post)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                      title={post.status === 'published' ? 'Switch to draft' : 'Publish story'}
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      to={`/post/${post.slug || post.id}`}
                      className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      title="View story"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/edit/${post.id}`}
                      className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      title="Edit story"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!postToDelete}
        title="Delete Story"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? All associated comments and analytics will also be removed.`}
        confirmLabel="Delete Story"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};
