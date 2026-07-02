/**
 * AdminLayout
 * Sidebar + Header layout for all admin pages.
 * Handles mobile sidebar toggle.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/formatters';
import '../styles/admin.css';

const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    end={to === '/admin/dashboard'}
    onClick={onClick}
    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const DashboardIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const NewsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AdminLayout = ({ children, title, subtitle }) => {
  const { admin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully.', 'success');
    navigate('/admin/login', { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} role="navigation" aria-label="Admin navigation">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">ESS Admin</div>
          <div className="sidebar-logo-subtitle">News Management</div>
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/admin/dashboard" icon={<DashboardIcon />} label="Dashboard" onClick={closeSidebar} />
          <NavItem to="/admin/news" icon={<NewsIcon />} label="News" onClick={closeSidebar} />
          <NavItem to="/admin/profile" icon={<ProfileIcon />} label="Profile" onClick={closeSidebar} />
        </nav>

        <div className="sidebar-footer">
          {admin && (
            <div className="sidebar-user">
              <div className="sidebar-avatar">{getInitials(admin.full_name)}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{admin.full_name}</div>
                <div className="sidebar-user-role">{admin.role}</div>
              </div>
            </div>
          )}
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              {title && <div className="admin-header-title">{title}</div>}
              {subtitle && <div className="admin-header-subtitle">{subtitle}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {admin && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {getInitials(admin.full_name)}
                </div>
                <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
                  {admin.full_name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;