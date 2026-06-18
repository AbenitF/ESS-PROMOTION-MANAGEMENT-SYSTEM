/**
 * Public News Detail Page
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { PageSpinner } from '../../components/Spinner';
import newsService from '../../services/newsService';
import { formatDate } from '../../utils/formatters';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    newsService.getById(id)
      .then((res) => setArticle(res.data.data))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PublicLayout><PageSpinner /></PublicLayout>;

  if (notFound || !article) return (
    <PublicLayout>
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '1rem' }}>Article Not Found</h2>
        <Link to="/news" className="btn btn-primary">Back to News</Link>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="detail-wrapper">
        <Link
          to="/news"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem', transition: 'color 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </Link>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--color-gray-400)', marginBottom: '1rem' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(article.created_at)}
        </div>

        {/* Title */}
        <h1 className="detail-title">{article.title}</h1>

        {/* Image */}
        {article.image_url && (
          <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--border-radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
            <img
              src={article.image_url}
              alt={article.title}
              style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{
          fontSize: '1.0625rem',
          color: 'var(--color-gray-700)',
          lineHeight: 1.9,
          whiteSpace: 'pre-line',
        }}>
          {article.content}
        </div>

        {/* Updated note */}
        {article.updated_at !== article.created_at && (
          <div style={{
            marginTop: '2.5rem',
            padding: '0.875rem 1.25rem',
            background: 'var(--color-gray-50)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.8125rem',
            color: 'var(--color-gray-500)',
          }}>
            Last updated: {formatDate(article.updated_at)}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/news" className="btn btn-outline">← Back to News</Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NewsDetailPage;
