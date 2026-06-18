/**
 * Public News Listing Page
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import newsService from '../../services/newsService';
import { formatDateShort, truncate } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsService.getAll({ search: debouncedSearch, page, limit: 9 });
      setNews(res.data.data.news || []);
      setPagination(res.data.data.pagination || {});
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <PublicLayout>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">News & Announcements</h1>
          <p className="page-hero-subtitle">
            Stay up-to-date with the latest news from the Ethiopian Statistical Service.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Featured (first article) */}
          {!loading && news.length > 0 && page === 1 && !debouncedSearch && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                Featured
              </div>
              <Link
                to={`/news/${news[0].id}`}
                style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem',
                  background: '#fff', borderRadius: 'var(--border-radius-xl)',
                  border: '1px solid var(--color-gray-200)',
                  boxShadow: 'var(--shadow-md)', overflow: 'hidden',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-xl)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              >
                {news[0].image_url ? (
                  <img src={news[0].image_url} alt={news[0].title}
                    style={{ width: '100%', height: '100%', minHeight: 280, objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: 280, color: '#fff',
                  }}>
                    <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div style={{ padding: '2rem 2rem 2rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', marginBottom: '0.75rem' }}>
                    {formatDateShort(news[0].created_at)}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gray-900)', lineHeight: 1.3, marginBottom: '1rem' }}>
                    {news[0].title}
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    {truncate(news[0].content, 200)}
                  </p>
                  <span className="read-more-link">
                    Read full article
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Search */}
          <div className="filters-bar" style={{ marginBottom: '2rem' }}>
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search news articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search news"
              />
            </div>
          </div>

          {!loading && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>
              {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}

          {loading ? (
            <div className="news-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="news-card" style={{ pointerEvents: 'none' }}>
                  <div className="skeleton" style={{ height: 200, width: '100%' }} />
                  <div className="news-card-body">
                    <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '90%', height: 18, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 4 }} />
                    <div className="skeleton" style={{ width: '75%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <EmptyState
              title="No articles found"
              message={debouncedSearch ? 'Try a different search term.' : 'No news articles are available yet.'}
            />
          ) : (
            <div className="news-grid">
              {(page === 1 && !debouncedSearch ? news.slice(1) : news).map((n) => (
                <Link to={`/news/${n.id}`} className="news-card" key={n.id}>
                  {n.image_url ? (
                    <img src={n.image_url} alt={n.title} className="news-card-image" loading="lazy" />
                  ) : (
                    <div className="news-card-image-placeholder">
                      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="news-card-body">
                    <div className="news-card-date">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDateShort(n.created_at)}
                    </div>
                    <h3 className="news-card-title">{n.title}</h3>
                    <p className="news-card-excerpt">{truncate(n.content, 130)}</p>
                  </div>
                  <div className="news-card-footer">
                    <span className="read-more-link">
                      Read more
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
              <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default NewsPage;
