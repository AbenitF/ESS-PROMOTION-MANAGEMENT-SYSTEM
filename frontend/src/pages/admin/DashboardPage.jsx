/**
 * Admin Dashboard Page
 * Shows statistics summary and recent items.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import newsService from '../../services/newsService';
import { useAuth } from '../../context/AuthContext';
import { formatDateShort, truncate } from '../../utils/formatters';
import { PageSpinner } from '../../components/Spinner';

const StatCard = ({ label, value, variant, icon, loading }) => (
  <div className={`stat-card ${variant}`}>
    <div className={`stat-icon ${variant}`}>{icon}</div>
    <div>
      {loading ? (
        <div className="skeleton" style={{ width: 60, height: 36, marginBottom: 6 }} />
      ) : (
        <div className="stat-value">{value ?? '—'}</div>
      )}
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { admin } = useAuth();
  const [newsCount, setNewsCount] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [newsRes, newsListRes] = await Promise.all([
          newsService.getAll({ page: 1, limit: 1 }),
          newsService.getAll({ page: 1, limit: 4 }),
        ]);
        setNewsCount(newsRes.data.data.pagination.total);
        setRecentNews(newsListRes.data.data.news || []);
      } catch {
        // Silently fail — individual sections show empty
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of ESS News Management">
      {/* Greeting */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
        color: '#fff',
        borderRadius: 'var(--border-radius-xl)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {greeting}, {admin?.full_name?.split(' ')[0]}!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
            Here's what's happening with your content today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/news/create" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            + New Article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total News Articles"
          value={newsCount}
          variant="info"
          loading={loading}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
      </div>

      {/* Recent Content */}
      {loading ? (
        <PageSpinner />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Recent News */}
          <div className="admin-table-wrapper">
            <div className="admin-table-header">
              <span className="admin-table-title">Recent News</span>
              <Link to="/admin/news" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {recentNews.length === 0 ? (
                <p style={{ padding: '1.5rem', color: 'var(--color-gray-500)', fontSize: '0.875rem', textAlign: 'center' }}>
                  No news articles yet.
                </p>
              ) : recentNews.map((n) => (
                <div key={n.id} style={{
                  padding: '0.875rem 1.5rem',
                  borderBottom: '1px solid var(--color-gray-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: '2px' }}>
                      {truncate(n.title, 50)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
                      {formatDateShort(n.created_at)}
                    </div>
                  </div>
                  <span className="badge badge-info">Published</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;