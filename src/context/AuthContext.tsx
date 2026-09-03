import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/index.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; profileImage?: string; bio?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  toggleBookmark: (postId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('blogsphere_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error, info } = useToast();

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token invalid or expired
        localStorage.removeItem('blogsphere_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        error(data.error || 'Invalid login credentials');
        return false;
      }

      localStorage.setItem('blogsphere_token', data.token);
      setToken(data.token);
      setUser(data.user);
      success(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (err) {
      error('Network error. Unable to connect to server.');
      return false;
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    bio?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        error(data.error || 'Registration failed');
        return false;
      }

      localStorage.setItem('blogsphere_token', data.token);
      setToken(data.token);
      setUser(data.user);
      success(`Account created! Welcome to BlogSphere, ${data.user.name}.`);
      return true;
    } catch (err) {
      error('Network error during registration.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('blogsphere_token');
    setToken(null);
    setUser(null);
    info('You have been logged out.');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        error(resData.error || 'Failed to update profile');
        return false;
      }

      setUser(resData.user);
      success('Profile updated successfully!');
      return true;
    } catch (err) {
      error('Network error updating profile');
      return false;
    }
  };

  const toggleBookmark = async (postId: string): Promise<boolean> => {
    if (!token || !user) {
      error('Please sign in to bookmark posts.');
      return false;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, bookmarks: data.bookmarks } : null));
        if (data.bookmarked) {
          success('Post saved to your bookmarks!');
        } else {
          info('Post removed from bookmarks.');
        }
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        toggleBookmark,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
