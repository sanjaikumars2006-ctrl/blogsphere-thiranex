import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Feather,
  Sun,
  Moon,
  PenSquare,
  LayoutDashboard,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
  BookOpen,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Explore', path: '/feed', icon: Compass },
    ...(isAuthenticated
      ? [
          { name: 'My Stories', path: '/my-blogs', icon: BookOpen },
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ]
      : []),
  ];

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md shadow-sm border-b border-zinc-200/80 dark:border-zinc-800/80'
          : 'bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-zinc-100 dark:to-indigo-300 bg-clip-text text-transparent">
                BlogSphere
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-indigo-600 dark:text-indigo-400 -mt-1">
                Modern Publishing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-900/80 p-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-800/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </motion.button>

            {/* Write Story Button */}
            <Link
              to={isAuthenticated ? '/create' : '/login'}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write</span>
            </Link>

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 transition-all active:scale-95"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="w-8 h-8 rounded-full border border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-20 overflow-hidden"
                      >
                        {/* User Header */}
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="p-1 space-y-0.5">
                          <Link
                            to="/create"
                            className="sm:hidden flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors"
                          >
                            <PenSquare className="w-4 h-4" />
                            <span>Write Story</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 text-zinc-500" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/my-blogs"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-zinc-500" />
                            <span>My Stories</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                            <span>Dashboard & Analytics</span>
                          </Link>
                        </div>

                        <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800 p-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <Link
              to={isAuthenticated ? '/create' : '/login'}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write a Story</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
