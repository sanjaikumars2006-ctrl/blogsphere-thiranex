import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code,
  Quote,
  List,
  Link2,
  Image as ImageIcon,
  Columns,
  Eye,
  PenLine,
  Check,
  X,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Post } from '../types/index.js';

const PRESET_COVERS = [
  {
    label: 'Modern Code',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'AI & Neural',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Cyber Motion',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Team Engineering',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Minimal Workspace',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Abstract Neon',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
  },
];

export const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { success, error, warning } = useToast();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [viewMode, setViewMode] = useState<'write' | 'split' | 'preview'>('write');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Technology',
    'AI',
    'Web Development',
    'Design',
    'Career',
    'Programming',
  ];

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          error('Story not found');
          navigate('/my-blogs');
          return;
        }

        const data = await res.json();
        const p: Post = data.post;

        // Check ownership
        if (user && p.authorId !== user.id && user.role !== 'admin') {
          error('You can only edit your own stories');
          navigate('/my-blogs');
          return;
        }

        setTitle(p.title);
        setExcerpt(p.excerpt || '');
        setContent(p.content);
        setCategory(p.category);
        setCoverImage(p.coverImage);
        setTags(p.tags || []);
        setStatus(p.status);
      } catch (err) {
        error('Failed to load story for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertMarkdown = (syntaxBefore: string, syntaxAfter = '') => {
    const textarea = document.getElementById('edit-blog-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end) || 'text';

    const replacement = `${syntaxBefore}${selectedText}${syntaxAfter}`;
    const newContent =
      previousText.substring(0, start) + replacement + previousText.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + selectedText.length
      );
    }, 0);
  };

  const handleUpdate = async (saveStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      warning('Story title cannot be empty.');
      return;
    }
    if (!content.trim()) {
      warning('Story content cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          coverImage,
          category,
          tags,
          status: saveStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to update post');
      } else {
        success('Story updated successfully!');
        navigate(`/post/${data.post.slug || data.post.id}`);
      }
    } catch (err) {
      error('Network error saving updates');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-500 font-medium">Loading story editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Edit Story
            </h1>
            <p className="text-xs text-zinc-500">
              Update your content, tags, or publishing status.
            </p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'write'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('draft')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{submitting ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Main */}
        <div className={viewMode === 'split' ? 'lg:col-span-3' : 'lg:col-span-2 space-y-6'}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Short Subtitle / Excerpt
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {(viewMode === 'write' || viewMode === 'split') && (
            <div className="mt-6 flex flex-wrap items-center gap-1.5 p-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('## ')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('### ')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('```typescript\n', '\n```')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](https://example.com)')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Hyperlink"
              >
                <Link2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-4">
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  id="edit-blog-textarea"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 text-sm font-mono rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-y-auto max-h-[500px] prose prose-zinc dark:prose-invert max-w-none text-sm">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-h-[400px]">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            ) : (
              <textarea
                id="edit-blog-textarea"
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-5 text-sm sm:text-base rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-xs"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        {viewMode !== 'split' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                  >
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Cover Image
              </label>
              <div className="w-full h-36 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="grid grid-cols-3 gap-2 pt-1">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
