import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, User, Post, Comment } from './db.js';
import { authenticateToken, optionalAuthToken, generateToken, AuthRequest } from './auth.js';

export const apiRouter = Router();

// Helper to sanitize user object (remove password)
function sanitizeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, profileImage, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      profileImage: profileImage?.trim() || defaultAvatar,
      bio: bio?.trim() || 'Tech enthusiast and writer on BlogSphere.',
      role: 'user',
      skills: ['FullStack', 'JavaScript'],
      bookmarks: [],
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user: sanitizeUser(req.user) });
});

apiRouter.put('/auth/profile', authenticateToken, (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, bio, profileImage, skills, website, github, twitter } = req.body;

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }

  const updated = db.updateUser(req.user.id, {
    ...(name !== undefined && { name: name.trim() }),
    ...(bio !== undefined && { bio: bio.trim() }),
    ...(profileImage !== undefined && { profileImage: profileImage.trim() }),
    ...(skills !== undefined && { skills: Array.isArray(skills) ? skills : [] }),
    ...(website !== undefined && { website: website.trim() }),
    ...(github !== undefined && { github: github.trim() }),
    ...(twitter !== undefined && { twitter: twitter.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    message: 'Profile updated successfully',
    user: sanitizeUser(updated),
  });
});

apiRouter.post('/auth/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// ----------------------------------------------------
// USERS PUBLIC PROFILE
// ----------------------------------------------------

apiRouter.get('/users/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userPosts = db.getPosts({ authorId: user.id, status: 'published' });
  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  return res.json({
    user: sanitizeUser(user),
    posts: userPosts,
    stats: {
      totalPosts: userPosts.length,
      totalLikes,
    },
  });
});

// ----------------------------------------------------
// BLOG POSTS ROUTES
// ----------------------------------------------------

apiRouter.get('/posts', (req, res) => {
  try {
    const { status, authorId, category, tag, search, sort } = req.query;

    const posts = db.getPosts({
      status: status as any,
      authorId: authorId as string,
      category: category as string,
      tag: tag as string,
      search: search as string,
      sort: sort as any,
    });

    return res.json({ posts, count: posts.length });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

apiRouter.get('/posts/:id', (req, res) => {
  try {
    const incrementViews = req.query.incViews === 'true';
    const post = db.getPostById(req.params.id, incrementViews);

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load post' });
  }
});

apiRouter.post('/posts', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const { title, excerpt, content, coverImage, category, tags, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Post title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    // Calculate reading time (~200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const defaultCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      slug: generatedSlug,
      title: title.trim(),
      excerpt: excerpt?.trim() || content.slice(0, 160).trim() + '...',
      content: content.trim(),
      coverImage: coverImage?.trim() || defaultCover,
      category: category?.trim() || 'Technology',
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : ['General'],
      authorId: user.id,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
      },
      status: status === 'draft' ? 'draft' : 'published',
      views: 0,
      likes: [],
      readTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedPost = db.createPost(newPost);
    return res.status(201).json({
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

apiRouter.put('/posts/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const post = db.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to edit this post' });
    }

    const { title, excerpt, content, coverImage, category, tags, status } = req.body;

    let readTime = post.readTime;
    if (content) {
      const wordCount = content.trim().split(/\s+/).length;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updated = db.updatePost(post.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(excerpt !== undefined && { excerpt: excerpt.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(coverImage !== undefined && { coverImage: coverImage.trim() }),
      ...(category !== undefined && { category: category.trim() }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : post.tags }),
      ...(status !== undefined && { status: status === 'draft' ? 'draft' : 'published' }),
      readTime,
    });

    return res.json({
      message: 'Post updated successfully',
      post: updated,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'Failed to update post' });
  }
});

apiRouter.delete('/posts/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const post = db.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    db.deletePost(post.id);
    return res.json({ message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
});

apiRouter.post('/posts/:id/like', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const result = db.toggleLikePost(req.params.id, user.id);

    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update like' });
  }
});

apiRouter.post('/posts/:id/bookmark', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const result = db.toggleBookmark(user.id, req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'User or post not found' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// ----------------------------------------------------
// COMMENTS ROUTES
// ----------------------------------------------------

apiRouter.get('/posts/:id/comments', (req, res) => {
  try {
    const post = db.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = db.getCommentsByPostId(post.id);
    return res.json({ comments, count: comments.length });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

apiRouter.post('/posts/:id/comments', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment text cannot be empty' });
    }

    const post = db.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      postId: post.id,
      authorId: user.id,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
      content: content.trim(),
      parentId: parentId || null,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.createComment(newComment);
    return res.status(201).json({
      message: 'Comment posted',
      comment: saved,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to post comment' });
  }
});

apiRouter.put('/comments/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = db.getCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const updated = db.updateComment(req.params.id, content.trim());
    return res.json({
      message: 'Comment updated',
      comment: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update comment' });
  }
});

apiRouter.delete('/comments/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const comment = db.getCommentById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    db.deleteComment(req.params.id);
    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
});

apiRouter.post('/comments/:id/like', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const result = db.toggleLikeComment(req.params.id, user.id);

    if (!result) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to like comment' });
  }
});

// ----------------------------------------------------
// DASHBOARD & AGGREGATE STATS
// ----------------------------------------------------

apiRouter.get('/stats/dashboard', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const stats = db.getUserDashboardStats(user.id);
    return res.json(stats);
  } catch (error) {
    console.error('Error computing dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to compute dashboard stats' });
  }
});

apiRouter.get('/categories', (req, res) => {
  return res.json({ categories: db.getCategories() });
});

apiRouter.get('/tags', (req, res) => {
  return res.json({ tags: db.getTags() });
});
