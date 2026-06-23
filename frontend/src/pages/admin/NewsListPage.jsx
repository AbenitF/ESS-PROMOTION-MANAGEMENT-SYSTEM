/**
 * Admin News List Page
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import { PageSpinner } from '../../components/Spinner';
import newsService from '../../services/newsService';
import { useToast } from '../../context/ToastContext';
import { formatDateShort, truncate, getErrorMessage } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';

const NewsListPage = () => {
  const { showToast } = useToast();
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsService.getAll({ search: debouncedSearch, page, limit: 10 });
      setNews(res.data.data.news || []);
      setPagination(res.data.data.pagination || {});
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, showToast]);

  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await newsService.delete(deleteTarget.id);
      showToast('News article deleted successfully.', 'success');
      setDeleteTarget(null);
      fetchNews();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="News" subtitle="Manage all news articles">
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <span className="admin-table-title">All News ({pagination.total})</span>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link to="/admin/news/create" className="btn btn-primary btn-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </Link>
          </div>
        </div>

        {loading ? (
          <PageSpinner />
        ) : news.length === 0 ? (
          <EmptyState
            title="No news articles found"
            message={debouncedSearch ? 'No results match your search.' : 'Publish your first news article.'}
            action={!debouncedSearch && (
              <Link to="/admin/news/create" className="btn btn-primary">Create Article</Link>
            )}
          />
        ) : (
          <>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Preview</th>
                    <th>Image</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((n, i) => (
                    <tr key={n.id}>
                      <td style={{ color: 'var(--color-gray-400)', fontWeight: 500 }}>
                        {(page - 1) * 10 + i + 1}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>
                          {truncate(n.title, 50)}
                        </div>
                      </td>
                      <td style={{ maxWidth: 240 }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
                          {truncate(n.content, 80)}
                        </span>
                      </td>
                      <td>
                        {n.image_url ? (
                          <img
                            src={n.image_url}
                            alt={n.title}
                            style={{ width: 48, height: 40, objectFit: 'cover', borderRadius: '0.375rem' }}
                          />
                        ) : <span style={{ color: 'var(--color-gray-400)', fontSize: '0.75rem' }}>No image</span>}
                      </td>
                      <td>{formatDateShort(n.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/admin/news/edit/${n.id}`} className="btn btn-outline btn-sm">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(n)}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-table-footer">
              <span>
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
              </span>
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete News Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
};

export default NewsListPage;
