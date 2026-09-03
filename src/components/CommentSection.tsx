import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Heart,
  CornerDownRight,
  Edit2,
  Trash2,
  Send,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { Comment } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { ConfirmModal } from './ConfirmModal.js';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (deletedCommentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Group comments into root comments and replies map
  const rootComments = comments.filter((c) => !c.parentId);
  const repliesByParent = comments.reduce((acc, c) => {
    if (c.parentId) {
      if (!acc[c.parentId]) acc[c.parentId] = [];
      acc[c.parentId].push(c);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
        body: JSON.stringify({ content: newCommentText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to post comment');
      } else {
        onCommentAdded(data.comment);
        setNewCommentText('');
        success('Comment posted successfully!');
      }
    } catch (err) {
      error('Network error posting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
        body: JSON.stringify({ content: replyText.trim(), parentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to post reply');
      } else {
        onCommentAdded(data.comment);
        setReplyingToId(null);
        setReplyText('');
        success('Reply posted!');
      }
    } catch (err) {
      error('Network error posting reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
        body: JSON.stringify({ content: editText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to update comment');
      } else {
        onCommentUpdated(data.comment);
        setEditingCommentId(null);
        setEditText('');
        success('Comment updated');
      }
    } catch (err) {
      error('Network error updating comment');
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      const res = await fetch(`/api/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
      });

      if (res.ok) {
        onCommentDeleted(commentToDelete);
        success('Comment deleted');
      } else {
        error('Failed to delete comment');
      }
    } catch (err) {
      error('Network error deleting comment');
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleLikeComment = async (comment: Comment) => {
    if (!isAuthenticated) {
      error('Please sign in to like comments');
      return;
    }

    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('blogsphere_token')}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        const nextLikes = data.liked
          ? [...(comment.likes || []), user!.id]
          : (comment.likes || []).filter((id) => id !== user!.id);
        onCommentUpdated({ ...comment, likes: nextLikes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user && (user.id === comment.authorId || user.role === 'admin');
    const isLiked = user && comment.likes?.includes(user.id);
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToId === comment.id;
    const replies = repliesByParent[comment.id] || [];

    const timeString = new Date(comment.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`group/comment relative ${
          isReply
            ? 'ml-6 sm:ml-10 mt-3 pt-3 border-l-2 border-indigo-100 dark:border-zinc-800 pl-4'
            : 'mt-6 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <img
              src={comment.author.profileImage}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {comment.author.name}
                </span>
                {comment.authorId === user?.id && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{timeString}</span>
            </div>
          </div>

          {/* Comment Owner Controls */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1 opacity-80 group-hover/comment:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditText(comment.content);
                }}
                className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Edit comment"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCommentToDelete(comment.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Delete comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Content / Edit Mode */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditText('');
                }}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(comment.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-line pl-11">
            {comment.content}
          </p>
        )}

        {/* Action Row */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-3 pl-11">
            <button
              type="button"
              onClick={() => handleLikeComment(comment)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isLiked
                  ? 'text-rose-500 font-semibold'
                  : 'text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                  isLiked ? 'fill-rose-500' : ''
                }`}
              />
              <span>{comment.likes?.length || 0}</span>
            </button>

            {!isReply && isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setReplyingToId(isReplying ? null : comment.id);
                  setReplyText('');
                }}
                className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>{isReplying ? 'Cancel Reply' : 'Reply'}</span>
              </button>
            )}
          </div>
        )}

        {/* Reply Input Box */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pl-11"
            >
              <div className="flex items-start gap-2">
                <textarea
                  rows={2}
                  placeholder={`Reply to ${comment.author.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  disabled={submitting || !replyText.trim()}
                  onClick={() => handleAddReply(comment.id)}
                  className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        {replies.length > 0 && (
          <div className="space-y-1">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section id="comments-section" className="pt-10 border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Comments ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-zinc-500">Join the discussion</span>
      </div>

      {/* New Comment Input */}
      {isAuthenticated ? (
        <form
          onSubmit={handleAddComment}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm mb-8"
        >
          <div className="flex items-start gap-3.5">
            <img
              src={user?.profileImage}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-indigo-500/30 shrink-0"
            />
            <div className="flex-1">
              <textarea
                rows={3}
                placeholder="Share your thoughts, feedback, or questions..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-[11px] text-zinc-400">
                  Markdown & friendly discussions welcome
                </p>
                <button
                  type="submit"
                  disabled={submitting || !newCommentText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gradient-to-r from-indigo-50/70 to-cyan-50/70 dark:from-indigo-950/30 dark:to-cyan-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-6 mb-8 text-center">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Want to join the conversation?
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Sign in to share your thoughts, applaud ideas, and reply to fellow readers.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            No comments yet
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Be the first to share your perspective on this story!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {rootComments.map((comment) => renderComment(comment))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to permanently delete this comment? Any replies to it will also be removed."
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCommentToDelete(null)}
      />
    </section>
  );
};
