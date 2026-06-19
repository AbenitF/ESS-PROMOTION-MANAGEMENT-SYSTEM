/**
 * Public Promotion Detail Page
 * Full description, requirements, and attachment download.
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { PageSpinner } from '../../components/Spinner';
import promotionService from '../../services/promotionService';
import { formatDate, isExpired, daysRemaining } from '../../utils/formatters';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    promotionService.getById(id)
      .then((res) => setPromotion(res.data.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PublicLayout><PageSpinner /></PublicLayout>;

  if (notFound || !promotion) return (
    <PublicLayout>
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '1rem' }}>
          Promotion Not Found
        </h2>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>
          This promotion may have been removed or the link is incorrect.
        </p>
        <Link to="/promotions" className="btn btn-primary">Back to Promotions</Link>
      </div>
    </PublicLayout>
  );

  const expired = isExpired(promotion.deadline);
  const days = daysRemaining(promotion.deadline);
  const downloadUrl = promotionService.getDownloadUrl(promotion.id);

  return (
    <PublicLayout>
      <div className="detail-wrapper">
        {/* Back */}
        <Link
          to="/promotions"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem', transition: 'color 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Promotions
        </Link>

        {/* Meta bar */}
        <div className="detail-meta-bar">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {promotion.department}
          </span>
          <span className={`badge badge-${promotion.status === 'active' && !expired ? 'success' : 'warning'}`}>
            {expired ? 'Closed' : promotion.status}
          </span>
          {!expired && days !== null && days <= 7 && (
            <span className="badge badge-danger">
              {days === 0 ? 'Closes today' : `${days} day${days !== 1 ? 's' : ''} left`}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="detail-title">{promotion.title}</h1>

        {/* Key dates */}
        <div style={{
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          padding: '1.25rem 1.5rem',
          background: 'var(--color-gray-50)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-gray-200)',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Published</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{formatDate(promotion.publish_date)}</div>
          </div>
          {promotion.deadline && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Deadline</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: expired ? 'var(--color-danger)' : 'var(--color-gray-800)' }}>
                {formatDate(promotion.deadline)}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="detail-section">
          <h2 className="detail-section-title">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Position Description
          </h2>
          <div className="detail-content">{promotion.description}</div>
        </div>

        {/* Requirements */}
        {promotion.requirements && (
          <div className="detail-section">
            <h2 className="detail-section-title">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Requirements
            </h2>
            <div className="detail-content">{promotion.requirements}</div>
          </div>
        )}

        {/* Download */}
        {promotion.attachment_url && (
          <div className="detail-section">
            <h2 className="detail-section-title">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attached Document
            </h2>
            <a
              href={downloadUrl}
              className="detail-download-btn"
              download
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Document
            </a>
          </div>
        )}

        {/* Back button */}
        <div style={{ marginTop: '2rem' }}>
          <Link to="/promotions" className="btn btn-outline">
            ← Back to All Promotions
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PromotionDetailPage;
