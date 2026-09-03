import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Globe,
  Github,
  Twitter,
  Edit3,
  BookOpen,
  Bookmark,
  Sparkles,
  X,
  Check,
  Plus,
} from 'lucide-react';
import { User, Post } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { BlogCard } from '../components/BlogCard.js';
import { BlogCardSkeleton } from '../components/SkeletonLoader.js';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
];

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'bookmarks'>('published');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editTwitter, setEditTwitter] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !id || (currentUser && currentUser.id === id);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const targetUserId = id || currentUser?.id;
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/users/${targetUserId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data.user);
          setUserPosts(data.posts || []);

          // If looking at own profile, also load bookmarked stories
          if (isOwnProfile && currentUser?.bookmarks?.length) {
            const allPostsRes = await fetch('/api/posts?status=published');
            const allPostsData = await allPostsRes.json();
            const bookmarks = (allPostsData.posts || []).filter((p: Post) =>
              currentUser.bookmarks.includes(p.id)
            );
            setBookmarkedPosts(bookmarks);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, currentUser, isOwnProfile]);

  const handleOpenEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditBio(currentUser.bio || '');
    setEditAvatar(currentUser.profileImage);
    setEditSkills(currentUser.skills || []);
    setEditWebsite(currentUser.website || '');
    setEditGithub(currentUser.github || '');
    setEditTwitter(currentUser.twitter || '');
    setIsEditModalOpen(true);
  };

  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (s && !editSkills.includes(s)) {
      setEditSkills([...editSkills, s]);
      setSkillInput('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      error('Name cannot be empty');
      return;
    }

    setSaving(true);
    const ok = await updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      profileImage: editAvatar.trim(),
      skills: editSkills,
      website: editWebsite.trim(),
      github: editGithub.trim(),
      twitter: editTwitter.trim(),
    });

    setSaving(false);
    if (ok) {
      setIsEditModalOpen(false);
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              name: editName.trim(),
              bio: editBio.trim(),
              profileImage: editAvatar.trim(),
              skills: editSkills,
              website: editWebsite.trim(),
              github: editGithub.trim(),
              twitter: editTwitter.trim(),
            }
          : null
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-500">Loading user profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">User not found</h2>
        <p className="text-sm text-zinc-500 mt-2">The requested profile does not exist.</p>
      </div>
    );
  }

  const joinDate = new Date(profileUser.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 space-y-10">
      {/* Profile Header Hero */}
      <div className="relative bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 dark:from-zinc-900 dark:to-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <img
            src={profileUser.profileImage}
            alt={profileUser.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {profileUser.name}
                </h1>
                <p className="text-xs text-zinc-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Author since {joinDate}</span>
                </p>
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs transition-colors self-center sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
              {profileUser.bio || 'Storyteller and thinker on BlogSphere.'}
            </p>

            {/* Skills Pills */}
            {profileUser.skills && profileUser.skills.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                {profileUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}
              {profileUser.github && (
                <a
                  href={profileUser.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profileUser.twitter && (
                <a
                  href={profileUser.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex items-center gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 -mb-4 transition-all ${
              activeTab === 'published'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Published Stories ({userPosts.length})</span>
          </button>

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 -mb-4 transition-all ${
                activeTab === 'bookmarks'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Bookmarks ({bookmarkedPosts.length})</span>
            </button>
          )}
        </div>

        {/* Stories Render */}
        {activeTab === 'published' ? (
          userPosts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No published stories yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <BlogCard key={post.id} post={post} layout="grid" />
              ))}
            </div>
          )
        ) : bookmarkedPosts.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
            <Bookmark className="w-10 h-10 text-zinc-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              No bookmarked stories
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Browse the explore feed and save interesting articles to read later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedPosts.map((post) => (
              <BlogCard key={post.id} post={post} layout="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Edit Public Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Avatar Picker */}
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={editAvatar}
                      alt="Avatar preview"
                      className="w-12 h-12 rounded-full object-cover border border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Paste image URL..."
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {AVATAR_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditAvatar(p)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                          editAvatar === p ? 'border-indigo-600 scale-110' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={p} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short bio about yourself, roles, interests..."
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Skills / Expertise
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add a skill (e.g. React, Python)..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {editSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold"
                      >
                        {sk}
                        <button
                          type="button"
                          onClick={() => setEditSkills(editSkills.filter((s) => s !== sk))}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Socials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
