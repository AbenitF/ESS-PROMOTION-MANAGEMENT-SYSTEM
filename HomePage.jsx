/**
 * Public Home Page
 * Hero, stats banner, latest promotions, latest news.
 * NO admin/login links anywhere.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import promotionService from '../../services/promotionService';
import newsService from '../../services/newsService';
import { formatDateShort, truncate, daysRemaining } from '../../utils/formatters';

const SkeletonCard = () => (
  <div className="promotion-card" style={{ pointerEvents: 'none' }}>
    <div className="promotion-card-header">
      <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: '80%', height: 22, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '60%', height: 22 }} />
    </div>
    <div className="promotion-card-body">
      <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '85%', height: 14 }} />
    </div>
    <div className="promotion-card-footer">
      <div className="skeleton" style={{ width: 80, height: 14 }} />
      <div className="skeleton" style={{ width: 60, height: 14 }} />
    </div>
  </div>
);

const HomePage = () => {
  const [promotions, setPromotions] = useState([]);
  const [news, setNews] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    promotionService.getLatest(6)
      .then((res) => setPromotions(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingPromos(false));

    newsService.getLatest(4)
      .then((res) => setNews(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingNews(false));

    promotionService.getStats()
      .then((res) => setStatsData(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <PublicLayout>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" />
              </svg>
              Internal Opportunities
            </div>
            <h1 className="hero-title" id="hero-title">
              ESS <span>Career</span><br />Advancement Portal
            </h1>
            <p className="hero-subtitle">
              Discover internal promotion opportunities and stay informed with the latest news and announcements from the Ethiopian Statistical Service.
            </p>
            <div className="hero-actions">
              <Link to="/promotions" className="hero-btn hero-btn-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Promotions
              </Link>
              <Link to="/news" className="hero-btn hero-btn-secondary">
                Latest News
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ───────────────────────────────────────── */}
      {statsData && (
        <section className="stats-banner">
          <div className="container">
            <div className="stats-banner-grid">
              <div>
                <div className="stat-item-value">{statsData.total}</div>
                <div className="stat-item-label">Total Promotions</div>
              </div>
              <div>
                <div className="stat-item-value">{statsData.active}</div>
                <div className="stat-item-label">Active Positions</div>
              </div>
              <div>
                <div className="stat-item-value">{statsData.expired}</div>
                <div className="stat-item-label">Closed Positions</div>
              </div>
              <div>
                <div className="stat-item-value">ESS</div>
                <div className="stat-item-label">Ethiopian Statistical Service</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Promotions ──────────────────────────────────── */}
      <section className="section" aria-labelledby="promotions-heading">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Opportunities</div>
              <h2 className="section-title" id="promotions-heading">Latest Promotions</h2>
            </div>
            <Link to="/promotions" className="btn btn-outline">
              View All Promotions
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loadingPromos ? (
            <div className="promotions-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : promotions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-500)' }}>
              No active promotions available at the moment.
            </div>
          ) : (
            <div className="promotions-grid">
              {promotions.map((p) => {
                const days = daysRemaining(p.deadline);
                const urgent = days !== null && days <= 7 && days >= 0;
                return (
                  <Link to={`/promotions/${p.id}`} className="promotion-card" key={p.id}>
                    <div className="promotion-card-header">
                      <div className="promotion-card-dept">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {p.department}
                      </div>
                      <h3 className="promotion-card-title">{p.title}</h3>
                    </div>
                    <div className="promotion-card-body">
                      <p className="promotion-card-desc">{truncate(p.description, 120)}</p>
                    </div>
                    <div className="promotion-card-footer">
                      <span className="promotion-card-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateShort(p.publish_date)}
                      </span>
                      {p.deadline && (
                        <span className={`promotion-card-meta ${urgent ? 'deadline-urgent' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {urgent
                            ? days === 0 ? 'Today' : `${days}d left`
                            : `Deadline: ${formatDateShort(p.deadline)}`}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Latest News ────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }} aria-labelledby="news-heading">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Announcements</div>
              <h2 className="section-title" id="news-heading">Latest News</h2>
            </div>
            <Link to="/news" className="btn btn-outline">
              View All News
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loadingNews ? (
            <div className="news-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="news-card" style={{ pointerEvents: 'none' }}>
                  <div className="skeleton news-card-image-placeholder" />
                  <div className="news-card-body">
                    <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '90%', height: 18, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '70%', height: 18, marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 4 }} />
                    <div className="skeleton" style={{ width: '80%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-500)' }}>
              No news articles available at the moment.
            </div>
          ) : (
            <div className="news-grid">
              {news.map((n) => (
                <Link to={`/news/${n.id}`} className="news-card" key={n.id}>
                  {n.image_url ? (
                    <img src={n.image_url} alt={n.title} className="news-card-image" loading="lazy" />
                  ) : (
                    <div className="news-card-image-placeholder">
                      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
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
                    <p className="news-card-excerpt">{truncate(n.content, 120)}</p>
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
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
