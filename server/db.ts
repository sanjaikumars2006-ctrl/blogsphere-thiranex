import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  bio?: string;
  role: 'user' | 'admin';
  skills?: string[];
  website?: string;
  github?: string;
  twitter?: string;
  bookmarks: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    bio?: string;
  };
  status: 'published' | 'draft';
  views: number;
  likes: string[];
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
  };
  content: string;
  parentId?: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface DatabaseData {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDataDirectory() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getInitialSeedData(): DatabaseData {
  const hashedPassword = bcrypt.hashSync('password123', 10);

  const users: User[] = [
    {
      id: 'usr-1',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: hashedPassword,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Senior Software Architect & Full-Stack Developer. Passionate about TypeScript, React, and scalable cloud systems.',
      role: 'admin',
      skills: ['TypeScript', 'React', 'Node.js', 'System Design', 'PostgreSQL'],
      website: 'https://alexmorgan.dev',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      bookmarks: ['post-2', 'post-4'],
      createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
      id: 'usr-2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: hashedPassword,
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'AI Researcher & ML Engineer exploring agentic workflows, LLMs, and generative technology.',
      role: 'user',
      skills: ['Python', 'PyTorch', 'Generative AI', 'Agents', 'FastAPI'],
      website: 'https://sarahchen.ai',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      bookmarks: ['post-1', 'post-3'],
      createdAt: '2025-02-14T10:30:00.000Z',
    },
    {
      id: 'usr-3',
      name: 'Marcus Vance',
      email: 'marcus@example.com',
      password: hashedPassword,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Lead UI/UX Designer & Frontend Craftsman. Building intuitive, accessible, and delightful design systems.',
      role: 'user',
      skills: ['Figma', 'UI/UX', 'TailwindCSS', 'Motion Design', 'Design Systems'],
      website: 'https://marcusvance.design',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      bookmarks: ['post-5'],
      createdAt: '2025-03-01T12:00:00.000Z',
    },
    {
      id: 'usr-4',
      name: 'Elena Rostova',
      email: 'elena@example.com',
      password: hashedPassword,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Engineering Manager & Tech Career Coach helping developers navigate their career growth and leadership.',
      role: 'user',
      skills: ['Engineering Management', 'Mentorship', 'Career Growth', 'Agile'],
      website: 'https://elenarostova.io',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      bookmarks: ['post-6'],
      createdAt: '2025-03-15T09:15:00.000Z',
    },
  ];

  const posts: Post[] = [
    {
      id: 'post-1',
      slug: 'mastering-modern-fullstack-architecture-2025',
      title: 'Mastering Modern Full-Stack Architecture in 2025',
      excerpt: 'A comprehensive guide on building scalable, type-safe full-stack web applications with React 19, TypeScript, and modern backend design patterns.',
      content: `## The Modern Full-Stack Shift

The landscape of web development has evolved dramatically. Moving beyond traditional client-server divides, modern full-stack engineering demands end-to-end type safety, optimistic UI updates, and sub-millisecond response times.

### 1. End-to-End Type Safety
With TypeScript 5.x and unified schema validators, you can share schemas seamlessly between database layers and React components. This eliminates runtime mismatches and boosts developer velocity.

\`\`\`typescript
// Shared Post Schema Contract
export interface PostContract {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}
\`\`\`

### 2. State & Caching Hierarchy
- **Server Cache**: Keep immutable entities cached close to the edge.
- **Client Cache**: Deduplicate requests and manage optimistic UI states.
- **Component State**: Strictly preserve transient UI states like active dropdowns or input drafts.

### 3. Key Takeaways
1. Always validate data at the network boundary.
2. Structure your APIs around RESTful resource verbs.
3. Prioritize clean user interactions with smooth animations and instant optimistic feedback.

> "True craftsmanship lies in the details—responsive layouts, tactile transitions, and unshakeable reliability."`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      category: 'Technology',
      tags: ['TypeScript', 'React', 'Architecture', 'FullStack'],
      authorId: 'usr-1',
      author: {
        id: 'usr-1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        bio: 'Senior Software Architect & Full-Stack Developer.',
      },
      status: 'published',
      views: 1420,
      likes: ['usr-2', 'usr-3', 'usr-4'],
      readTime: 6,
      createdAt: '2025-05-10T14:30:00.000Z',
      updatedAt: '2025-05-10T14:30:00.000Z',
    },
    {
      id: 'post-2',
      slug: 'demystifying-agentic-ai-workflows',
      title: 'Demystifying Agentic AI Workflows and Autonomous Systems',
      excerpt: 'Explore how reasoning loops, tool-calling capabilities, and multi-agent coordination are transforming automation across industries.',
      content: `## Why AI Agents Are the Next Computing Frontier

We have transitioned from passive chatbot interfaces to proactive, autonomous AI agents capable of planning multi-step actions, interacting with toolkits, and recovering from errors dynamically.

### Core Anatomy of an Agent
1. **Perception**: Receiving input multimodal context and system constraints.
2. **Reasoning Loop**: ReAct (Reason + Act) loop formulating the next hypothesis.
3. **Execution**: Calling tools and APIs to mutate system state.
4. **Reflection**: Evaluating whether the action succeeded or needs correction.

\`\`\`python
class AutonomousAgent:
    def __init__(self, tools, llm):
        self.tools = tools
        self.llm = llm
        self.memory = []

    def execute_plan(self, goal: str):
        while not self.is_completed(goal):
            step = self.llm.decide_next_step(goal, self.memory)
            result = self.execute_tool(step.tool, step.args)
            self.memory.append((step, result))
\`\`\`

### Practical Tips for Developers
- Keep tool contracts small and atomic.
- Provide explicit error schemas for automatic self-correction.
- Never pass sensitive credentials to untrusted client code.`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      category: 'AI',
      tags: ['AI', 'MachineLearning', 'Agents', 'Python'],
      authorId: 'usr-2',
      author: {
        id: 'usr-2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        bio: 'AI Researcher & ML Engineer exploring agentic workflows.',
      },
      status: 'published',
      views: 980,
      likes: ['usr-1', 'usr-3'],
      readTime: 5,
      createdAt: '2025-05-14T09:20:00.000Z',
      updatedAt: '2025-05-14T09:20:00.000Z',
    },
    {
      id: 'post-3',
      slug: 'crafting-micro-interactions-with-framer-motion',
      title: 'Crafting Tactile Micro-Interactions with Framer Motion',
      excerpt: 'Learn the principles of physics-based spring animations, gesture physics, and exit transitions to make your web apps feel alive.',
      content: `## Motion as a Functional Guide

Animation on the web shouldn't merely be decorative; it should serve as visual reassurance, providing tactile feedback to every user interaction.

### Spring Physics vs Easing Curves
Standard cubic bezier curves can feel rigid or artificial. Natural spring physics provide dynamic responsiveness that adapts to user velocity.

\`\`\`tsx
import { motion } from "motion/react";

export const TactileButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    onClick={onClick}
    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-lg"
  >
    {children}
  </motion.button>
);
\`\`\`

### Golden Rules of Web Motion
- Keep interactive feedback under 200ms.
- Always respect \`prefers-reduced-motion\`.
- Use staggered reveals for lists to avoid visual pop-in.`,
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      category: 'Design',
      tags: ['FramerMotion', 'UIUX', 'Animation', 'CSS'],
      authorId: 'usr-3',
      author: {
        id: 'usr-3',
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        bio: 'Lead UI/UX Designer & Frontend Craftsman.',
      },
      status: 'published',
      views: 810,
      likes: ['usr-1', 'usr-2', 'usr-4'],
      readTime: 4,
      createdAt: '2025-05-18T16:45:00.000Z',
      updatedAt: '2025-05-18T16:45:00.000Z',
    },
    {
      id: 'post-4',
      slug: 'from-junior-to-lead-the-engineering-roadmap',
      title: 'From Junior to Lead: The Unspoken Engineering Roadmap',
      excerpt: 'Technical excellence is only half the battle. Discover the critical soft skills, system mindset, and leadership habits needed to grow.',
      content: `## The Evolution of Seniority

Early in a software career, success is measured by tickets closed and lines of code written. As you advance towards senior and lead roles, success shifts towards impact, team enablement, and reducing organizational complexity.

### The Three Pillars of Senior Engineering
1. **Technical Judgment**: Choosing what NOT to build is often more impactful than what you choose to build.
2. **Clarity in Communication**: Writing concise RFCs and architectural decision records (ADRs).
3. **Multiplier Effect**: Mentoring teammates, conducting empathetic code reviews, and unblocking fellow engineers.

### How to Accelerate Your Growth
- Step up to tackle ambiguous, cross-functional problems.
- Master trade-off analysis: latency vs cost, consistency vs availability.
- Regularly share knowledge through tech talks and internal blogs.`,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      category: 'Career',
      tags: ['Career', 'Leadership', 'Mentorship', 'Growth'],
      authorId: 'usr-4',
      author: {
        id: 'usr-4',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        bio: 'Engineering Manager & Tech Career Coach.',
      },
      status: 'published',
      views: 1150,
      likes: ['usr-1', 'usr-2'],
      readTime: 5,
      createdAt: '2025-05-20T11:10:00.000Z',
      updatedAt: '2025-05-20T11:10:00.000Z',
    },
    {
      id: 'post-5',
      slug: 'building-performant-apis-with-nodejs-and-express',
      title: 'Building Performant APIs with Node.js and Express',
      excerpt: 'Best practices for organizing Express route handlers, middleware pipelines, rate limiting, and robust error management.',
      content: `## Structuring Production-Grade Express APIs

Express remains one of the most flexible frameworks in the Node.js ecosystem. With clean architectural patterns, it delivers blistering performance and maintainable codebases.

### 1. Unified Async Error Middleware
Avoid repetitive try-catch blocks with central wrapper utilities:

\`\`\`typescript
export const asyncHandler = (fn: any) => 
  (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
\`\`\`

### 2. Defensive Validation
Always sanitize and validate request bodies using typed schemas before letting queries touch persistence layers.

### 3. Graceful Shutdown
Handle \`SIGTERM\` and \`SIGINT\` signals properly to allow active in-flight requests to complete before terminating.`,
      coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&auto=format&fit=crop&q=80',
      category: 'Programming',
      tags: ['NodeJS', 'Express', 'Backend', 'APIs'],
      authorId: 'usr-1',
      author: {
        id: 'usr-1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        bio: 'Senior Software Architect & Full-Stack Developer.',
      },
      status: 'published',
      views: 740,
      likes: ['usr-3'],
      readTime: 4,
      createdAt: '2025-05-22T13:00:00.000Z',
      updatedAt: '2025-05-22T13:00:00.000Z',
    },
    {
      id: 'post-6',
      slug: 'the-art-of-modern-css-and-tailwind-v4',
      title: 'The Art of Modern CSS and Tailwind v4',
      excerpt: 'Deep dive into container queries, color-mix functions, modern grid subgrids, and how Tailwind CSS v4 streamlines styling.',
      content: `## The Next Era of CSS Styling

CSS has advanced faster in the last two years than in the previous decade combined. Features like CSS nesting, color-mix(), and container queries are now universally available across all modern browsers.

### Why Tailwind v4 Shines
- Instant compilation powered by Rust lightningcss.
- Simplified single @import declaration.
- Direct CSS variable theming without complex config files.

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(0.6 0.25 260);
}
\`\`\`

Adopt semantic markup and let modern utility classes handle responsive typography and accessible color contrasts effortlessly!`,
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      category: 'Web Development',
      tags: ['CSS', 'TailwindCSS', 'Frontend', 'WebDev'],
      authorId: 'usr-3',
      author: {
        id: 'usr-3',
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        bio: 'Lead UI/UX Designer & Frontend Craftsman.',
      },
      status: 'published',
      views: 650,
      likes: ['usr-1', 'usr-2'],
      readTime: 3,
      createdAt: '2025-05-24T08:30:00.000Z',
      updatedAt: '2025-05-24T08:30:00.000Z',
    },
  ];

  const comments: Comment[] = [
    {
      id: 'cmt-1',
      postId: 'post-1',
      authorId: 'usr-2',
      author: {
        id: 'usr-2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      },
      content: 'Fantastic breakdown, Alex! The section on state hierarchy resonates deeply. We often see teams over-complicating client-side caches when simpler HTTP caching solves 80% of problems.',
      parentId: null,
      likes: ['usr-1', 'usr-3'],
      createdAt: '2025-05-11T10:15:00.000Z',
      updatedAt: '2025-05-11T10:15:00.000Z',
    },
    {
      id: 'cmt-2',
      postId: 'post-1',
      authorId: 'usr-1',
      author: {
        id: 'usr-1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      },
      content: 'Thanks Sarah! Exactly—cache invalidation remains one of the classic hard problems, so keeping the cache boundary well-defined is essential.',
      parentId: 'cmt-1',
      likes: ['usr-2'],
      createdAt: '2025-05-11T11:45:00.000Z',
      updatedAt: '2025-05-11T11:45:00.000Z',
    },
    {
      id: 'cmt-3',
      postId: 'post-2',
      authorId: 'usr-3',
      author: {
        id: 'usr-3',
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      },
      content: 'Great insights on agent loops. How do you usually handle visual loading feedback when an agent takes 5-10 seconds to reason through multi-step tools?',
      parentId: null,
      likes: ['usr-2'],
      createdAt: '2025-05-15T14:20:00.000Z',
      updatedAt: '2025-05-15T14:20:00.000Z',
    },
    {
      id: 'cmt-4',
      postId: 'post-3',
      authorId: 'usr-4',
      author: {
        id: 'usr-4',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      },
      content: 'The spring animation example is spot-on. Adding subtle physical cues makes interfaces feel so much more premium and responsive.',
      parentId: null,
      likes: ['usr-3'],
      createdAt: '2025-05-19T09:05:00.000Z',
      updatedAt: '2025-05-19T09:05:00.000Z',
    }
  ];

  return { users, posts, comments };
}

class Database {
  private data: DatabaseData;

  constructor() {
    ensureDataDirectory();
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && parsed.posts && parsed.comments) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading db.json, falling back to seed data', e);
    }

    const seed = getInitialSeedData();
    this.saveDataDirect(seed);
    return seed;
  }

  private saveDataDirect(data: DatabaseData) {
    try {
      ensureDataDirectory();
      const tempPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('Failed to write database file', err);
    }
  }

  private persist() {
    this.saveDataDirect(this.data);
  }

  // User Operations
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    
    // Also update denormalized author info in posts & comments
    const updatedUser = this.data.users[idx];
    this.data.posts.forEach((p) => {
      if (p.authorId === id) {
        p.author.name = updatedUser.name;
        p.author.profileImage = updatedUser.profileImage;
        p.author.bio = updatedUser.bio;
      }
    });
    this.data.comments.forEach((c) => {
      if (c.authorId === id) {
        c.author.name = updatedUser.name;
        c.author.profileImage = updatedUser.profileImage;
      }
    });

    this.persist();
    return this.data.users[idx];
  }

  // Post Operations
  getPosts(filter?: {
    status?: 'published' | 'draft' | 'all';
    authorId?: string;
    category?: string;
    tag?: string;
    search?: string;
    sort?: 'newest' | 'popular' | 'oldest';
  }): Post[] {
    let posts = [...this.data.posts];

    if (filter) {
      if (filter.status && filter.status !== 'all') {
        posts = posts.filter((p) => p.status === filter.status);
      } else if (!filter.status) {
        // default to published
        posts = posts.filter((p) => p.status === 'published');
      }

      if (filter.authorId) {
        posts = posts.filter((p) => p.authorId === filter.authorId);
      }

      if (filter.category && filter.category !== 'All') {
        posts = posts.filter(
          (p) => p.category.toLowerCase() === filter.category!.toLowerCase()
        );
      }

      if (filter.tag) {
        posts = posts.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === filter.tag!.toLowerCase())
        );
      }

      if (filter.search) {
        const query = filter.search.toLowerCase().trim();
        posts = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.excerpt.toLowerCase().includes(query) ||
            p.content.toLowerCase().includes(query) ||
            p.author.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        );
      }

      if (filter.sort === 'popular') {
        posts.sort((a, b) => b.likes.length * 3 + b.views - (a.likes.length * 3 + a.views));
      } else if (filter.sort === 'oldest') {
        posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        // newest first
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      posts = posts.filter((p) => p.status === 'published');
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return posts;
  }

  getPostById(id: string, incrementViews = false): Post | undefined {
    const post = this.data.posts.find((p) => p.id === id || p.slug === id);
    if (post && incrementViews) {
      post.views = (post.views || 0) + 1;
      this.persist();
    }
    return post;
  }

  createPost(post: Post): Post {
    this.data.posts.unshift(post);
    this.persist();
    return post;
  }

  updatePost(id: string, updates: Partial<Post>): Post | undefined {
    const idx = this.data.posts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.posts[idx] = {
      ...this.data.posts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.posts[idx];
  }

  deletePost(id: string): boolean {
    const idx = this.data.posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.posts.splice(idx, 1);
    // Delete associated comments
    this.data.comments = this.data.comments.filter((c) => c.postId !== id);
    this.persist();
    return true;
  }

  toggleLikePost(postId: string, userId: string): { liked: boolean; likesCount: number } | null {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return null;
    if (!post.likes) post.likes = [];

    const existingIdx = post.likes.indexOf(userId);
    let liked = false;
    if (existingIdx !== -1) {
      post.likes.splice(existingIdx, 1);
      liked = false;
    } else {
      post.likes.push(userId);
      liked = true;
    }
    this.persist();
    return { liked, likesCount: post.likes.length };
  }

  toggleBookmark(userId: string, postId: string): { bookmarked: boolean; bookmarks: string[] } | null {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return null;
    if (!user.bookmarks) user.bookmarks = [];

    const idx = user.bookmarks.indexOf(postId);
    let bookmarked = false;
    if (idx !== -1) {
      user.bookmarks.splice(idx, 1);
      bookmarked = false;
    } else {
      user.bookmarks.push(postId);
      bookmarked = true;
    }
    this.persist();
    return { bookmarked, bookmarks: user.bookmarks };
  }

  // Comments Operations
  getCommentsByPostId(postId: string): Comment[] {
    return this.data.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getCommentById(id: string): Comment | undefined {
    return this.data.comments.find((c) => c.id === id);
  }

  createComment(comment: Comment): Comment {
    this.data.comments.push(comment);
    this.persist();
    return comment;
  }

  updateComment(id: string, content: string): Comment | undefined {
    const comment = this.data.comments.find((c) => c.id === id);
    if (!comment) return undefined;
    comment.content = content;
    comment.updatedAt = new Date().toISOString();
    this.persist();
    return comment;
  }

  deleteComment(id: string): boolean {
    const idx = this.data.comments.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    // Also delete replies if any
    const commentId = this.data.comments[idx].id;
    this.data.comments = this.data.comments.filter((c) => c.id !== commentId && c.parentId !== commentId);
    this.persist();
    return true;
  }

  toggleLikeComment(commentId: string, userId: string): { liked: boolean; likesCount: number } | null {
    const comment = this.data.comments.find((c) => c.id === commentId);
    if (!comment) return null;
    if (!comment.likes) comment.likes = [];

    const idx = comment.likes.indexOf(userId);
    let liked = false;
    if (idx !== -1) {
      comment.likes.splice(idx, 1);
      liked = false;
    } else {
      comment.likes.push(userId);
      liked = true;
    }
    this.persist();
    return { liked, likesCount: comment.likes.length };
  }

  // Dashboard & Stats
  getUserDashboardStats(userId: string) {
    const userPosts = this.data.posts.filter((p) => p.authorId === userId);
    const publishedCount = userPosts.filter((p) => p.status === 'published').length;
    const draftCount = userPosts.filter((p) => p.status === 'draft').length;

    const userPostIds = new Set(userPosts.map((p) => p.id));
    const commentsOnUserPosts = this.data.comments.filter((c) => userPostIds.has(c.postId));
    const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
    const totalViews = userPosts.reduce((acc, p) => acc + (p.views || 0), 0);

    // Categories breakdown
    const categoryMap = new Map<string, number>();
    userPosts.forEach((p) => {
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
    });
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    // Generate monthly views data
    const monthlyViews = [
      { month: 'Jan', views: Math.floor(totalViews * 0.1) + 120, likes: Math.floor(totalLikes * 0.1) + 8 },
      { month: 'Feb', views: Math.floor(totalViews * 0.15) + 180, likes: Math.floor(totalLikes * 0.15) + 14 },
      { month: 'Mar', views: Math.floor(totalViews * 0.2) + 240, likes: Math.floor(totalLikes * 0.2) + 22 },
      { month: 'Apr', views: Math.floor(totalViews * 0.25) + 310, likes: Math.floor(totalLikes * 0.25) + 35 },
      { month: 'May', views: Math.floor(totalViews * 0.3) + 400, likes: Math.floor(totalLikes * 0.3) + 48 },
    ];

    const recentComments = commentsOnUserPosts.slice(0, 6).map((c) => {
      const post = this.data.posts.find((p) => p.id === c.postId);
      return {
        id: c.id,
        content: c.content,
        postTitle: post?.title || 'Unknown Post',
        postId: c.postId,
        authorName: c.author.name,
        authorImage: c.author.profileImage,
        createdAt: c.createdAt,
      };
    });

    return {
      totalPosts: userPosts.length,
      publishedCount,
      draftCount,
      totalComments: commentsOnUserPosts.length,
      totalLikes,
      totalViews,
      monthlyViews,
      categoryBreakdown,
      recentPosts: userPosts.slice(0, 5),
      recentComments,
    };
  }

  getCategories() {
    const categories = ['Technology', 'AI', 'Web Development', 'Programming', 'Career', 'Design'];
    const map = new Map<string, number>();
    categories.forEach((c) => map.set(c, 0));

    this.data.posts
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      });

    return categories.map((name) => ({
      name,
      count: map.get(name) || 0,
      description: `Explore the latest stories and insights in ${name}.`,
    }));
  }

  getTags() {
    const tagCount = new Map<string, number>();
    this.data.posts
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        p.tags.forEach((t) => {
          tagCount.set(t, (tagCount.get(t) || 0) + 1);
        });
      });

    return Array.from(tagCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
}

export const db = new Database();
