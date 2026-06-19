/**
 * Public Promotions Listing Page
 * Search, department filter, pagination.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import promotionService from '../../services/promotionService';
import { formatDateShort, truncate, daysRemaining } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await promotionService.getAll({
        search: debouncedSearch,
        department,
        status,
        page,
        limit: 9,
      });
      setPromotions(res.data.data.promotions || []);
      setPagination(res.data.data.pagination || {});
    } catch {
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, department, status, page]);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);
  useEffect(() => { setPage(1); }, [debouncedSearch, department, status]);

  useEffect(() => {
    promotionService.getDepartments()
      .then((res) => setDepartments(res.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <PublicLayout>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Internal Promotions</h1>
          <p className="page-hero-subtitle">
            Explore current promotion opportunities at the Ethiopian Statistical Service.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="filters-bar">
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search promotions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search promotions"
              />
            </div>

            <select
              className="filter-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Results count */}
          {!loading && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>
              {pagination.total} promotion{pagination.total !== 1 ? 's' : ''} found
              {debouncedSearch && ` for "${debouncedSearch}"`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="promotions-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ height: 280 }}>
                  <div className="card-body">
                    <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 12 }} />
                    <div className="skeleton" style={{ width: '85%', height: 20, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '60%', height: 20, marginBottom: 16 }} />
                    <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '80%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <EmptyState
              title="No promotions found"
              message={
                debouncedSearch || department
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No promotions are available at this time. Please check back later.'
              }
            />
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
                      <p className="promotion-card-desc">{truncate(p.description, 130)}</p>
                    </div>
                    <div className="promotion-card-footer">
                      <span className="promotion-card-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Posted: {formatDateShort(p.publish_date)}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {p.deadline && (
                          <span className={`promotion-card-meta ${urgent ? 'deadline-urgent' : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {days !== null && days < 0 ? 'Closed' : urgent ? `${days}d left` : formatDateShort(p.deadline)}
                          </span>
                        )}
                        <span className={`badge badge-${p.status === 'active' ? 'success' : 'warning'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default PromotionsPage;
