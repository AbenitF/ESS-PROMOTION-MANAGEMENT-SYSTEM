/**
 * App.jsx — Root Router
 * Public and Admin routes are completely separated.
 * Admin routes are lazy-loaded for code splitting.
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { PageSpinner } from './components/Spinner';

// ─── Public Pages (eager loaded for fast initial render) ──────────────────────
import HomePage            from './pages/public/HomePage';
import PromotionsPage      from './pages/public/PromotionsPage';
import PromotionDetailPage from './pages/public/PromotionDetailPage';
import NewsPage            from './pages/public/NewsPage';
import NewsDetailPage      from './pages/public/NewsDetailPage';
import AboutPage           from './pages/public/AboutPage';

// ─── Admin Pages (lazy loaded) ────────────────────────────────────────────────
const LoginPage     = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const NewsListPage  = lazy(() => import('./pages/admin/NewsListPage'));
const NewsFormPage  = lazy(() => import('./pages/admin/NewsFormPage'));
const ProfilePage   = lazy(() => import('./pages/admin/ProfilePage'));

const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* ── Public Routes ─────────────────────────────────── */}
            <Route path="/"              element={<HomePage />} />
            <Route path="/promotions"    element={<PromotionsPage />} />
            <Route path="/promotions/:id" element={<PromotionDetailPage />} />
            <Route path="/news"          element={<NewsPage />} />
            <Route path="/news/:id"      element={<NewsDetailPage />} />
            <Route path="/about"         element={<AboutPage />} />

            {/* ── Admin Routes ──────────────────────────────────── */}
            {/* Redirect /admin → /admin/login (or dashboard if authenticated) */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Login — no auth required */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute><NewsListPage /></ProtectedRoute>
            } />
            <Route path="/admin/news/create" element={
              <ProtectedRoute><NewsFormPage /></ProtectedRoute>
            } />
            <Route path="/admin/news/edit/:id" element={
              <ProtectedRoute><NewsFormPage /></ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-family)', textAlign: 'center', padding: '2rem',
              }}>
                <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--color-gray-200)', lineHeight: 1 }}>404</div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-700)', margin: '1rem 0 0.5rem' }}>Page not found</h1>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);

export default App;