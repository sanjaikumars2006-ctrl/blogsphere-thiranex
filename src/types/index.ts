export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profileImage: string;
  bio?: string;
  role: 'user' | 'admin';
  skills?: string[];
  website?: string;
  github?: string;
  twitter?: string;
  bookmarks: string[]; // post IDs
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
  likes: string[]; // user IDs who liked
  readTime: number; // in minutes
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
  likes: string[]; // user IDs
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedCount: number;
  draftCount: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
  monthlyViews: { month: string; views: number; likes: number }[];
  categoryBreakdown: { category: string; count: number }[];
  recentPosts: Post[];
  recentComments: {
    id: string;
    content: string;
    postTitle: string;
    postId: string;
    authorName: string;
    authorImage: string;
    createdAt: string;
  }[];
}

export interface CategoryInfo {
  name: string;
  count: number;
  description: string;
  iconName: string;
}
