import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code,
  Quote,
  List,
  Link2,
  Eye,
  Columns,
  PenLine,
  Check,
  X,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

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

export const CreateBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { success, error, warning } = useToast();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [tags, setTags] = useState<string[]>(['FullStack', 'WebDev']);
  const [tagInput, setTagInput] = useState('');
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

  // Tag handling
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

  // Markdown toolbar insertion
  const insertMarkdown = (syntaxBefore: string, syntaxAfter = '') => {
    const textarea = document.getElementById('blog-editor-textarea') as HTMLTextAreaElement;
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

  // Word count & read time calculations
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (submitting) return;

    if (!title.trim()) {
      warning('Please provide a title for your story.');
      return;
    }
    if (!content.trim()) {
      warning('Please write some content before publishing.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || undefined,
          content: content.trim(),
          coverImage,
          category,
          tags,
          status,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        error(data.error || 'Failed to save post');
        return;
      }

      if (!data.post?.slug && !data.post?.id) {
        error('Post was saved, but the article link was not returned.');
        return;
      } else {
        if (status === 'published') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          success('Story published successfully!');
        } else {
          success('Story saved as draft.');
        }
        navigate(`/post/${data.post.slug || data.post.id}`);
      }
    } catch (err) {
      error('Network error saving story');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Create New Story
            </h1>
            <p className="text-xs text-zinc-500">
              Draft, style with markdown, and publish to the global community.
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Submit Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'write'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{submitting ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className={viewMode === 'split' ? 'lg:col-span-3' : 'lg:col-span-2 space-y-6'}>
          {/* Story Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              placeholder="Give your story a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          {/* Short Excerpt */}
          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Short Subtitle / Excerpt
            </label>
            <input
              type="text"
              placeholder="Brief summary shown on blog cards (optional)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Markdown Formatting Toolbar */}
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
              <button
                type="button"
                onClick={() => insertMarkdown('![Image description](', ')')}
                className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                title="Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Content Area according to viewMode */}
          <div className="mt-4">
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <textarea
                    id="blog-editor-textarea"
                    rows={18}
                    placeholder="Write your story using markdown syntax..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 text-sm font-mono rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-y-auto max-h-[500px] prose prose-zinc dark:prose-invert max-w-none text-sm">
                  <Markdown>{content || '*Preview will appear here...*'}</Markdown>
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-h-[400px] shadow-sm">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <Markdown>{content || '# Nothing to preview yet'}</Markdown>
                </div>
              </div>
            ) : (
              <textarea
                id="blog-editor-textarea"
                rows={16}
                placeholder="Write your story in markdown. Express your ideas, code snippets, diagrams, and stories..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-5 text-sm sm:text-base rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed shadow-xs"
              />
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-2">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
              <span>•</span>
              <span>~{readTime} min read</span>
            </div>
            <span className="text-[11px] text-zinc-400">Auto-calculated</span>
          </div>
        </div>

        {/* Sidebar Settings Section */}
        {viewMode !== 'split' && (
          <div className="space-y-6">
            {/* Category Selector */}
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

            {/* Tags Selector */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag and press enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-indigo-950 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Image Picker */}
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
                placeholder="Or paste custom image URL..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div>
                <p className="text-[11px] font-semibold text-zinc-400 mb-2">Preset Covers</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
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
          </div>
        )}
      </div>
    </div>
  );
};
