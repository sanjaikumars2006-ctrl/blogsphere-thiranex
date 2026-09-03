import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider } from './context/ToastContext.js';

import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

import { HomePage } from './pages/HomePage.js';
import { FeedPage } from './pages/FeedPage.js';
import { BlogDetailPage } from './pages/BlogDetailPage.js';
import { CreateBlogPage } from './pages/CreateBlogPage.js';
import { EditBlogPage } from './pages/EditBlogPage.js';
import { MyBlogsPage } from './pages/MyBlogsPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/post/:id" element={<BlogDetailPage />} />
                  <Route path="/author/:id" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <CreateBlogPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit/:id"
                    element={
                      <ProtectedRoute>
                        <EditBlogPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-blogs"
                    element={
                      <ProtectedRoute>
                        <MyBlogsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 fallback */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
