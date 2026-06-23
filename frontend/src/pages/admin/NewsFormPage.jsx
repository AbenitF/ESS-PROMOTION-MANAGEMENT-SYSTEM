/**
 * Admin News Form Page
 * Handles both Create and Edit modes.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { PageSpinner } from '../../components/Spinner';
import Spinner from '../../components/Spinner';
import newsService from '../../services/newsService';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/formatters';

const NewsFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchArticle = async () => {
      try {
        const res = await newsService.getById(id);
        const n = res.data.data;
        setForm({ title: n.title || '', content: n.content || '' });
        if (n.image_url) setExistingImage(n.image_url);
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
        navigate('/admin/news');
      } finally {
        setPageLoading(false);
      }
    };
    fetchArticle();
  }, [id, isEdit, navigate, showToast]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.content.trim()) errs.content = 'Content is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (imageFile) formData.append('image', imageFile);
    if (removeImage) formData.append('remove_image', 'true');

    try {
      if (isEdit) {
        await newsService.update(id, formData);
        showToast('News article updated successfully.', 'success');
      } else {
        await newsService.create(formData);
        showToast('News article created successfully.', 'success');
      }
      navigate('/admin/news');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return (
    <AdminLayout title={isEdit ? 'Edit Article' : 'Create Article'}>
      <PageSpinner />
    </AdminLayout>
  );

  const displayImage = imagePreview || (existingImage && !removeImage ? existingImage : null);

  return (
    <AdminLayout
      title={isEdit ? 'Edit News Article' : 'Create News Article'}
      subtitle={isEdit ? 'Update article content' : 'Publish a new news article'}
    >
      <div className="admin-form-wrapper">
        <div className="admin-form-header">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>
            {isEdit ? 'Edit Article' : 'New Article'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">Article Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-control ${errors.title ? 'is-error' : ''}`}
                placeholder="Enter article title..."
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label" htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                className={`form-control ${errors.content ? 'is-error' : ''}`}
                placeholder="Write the full article content..."
                value={form.content}
                onChange={handleChange}
                rows={10}
              />
              {errors.content && <div className="form-error">{errors.content}</div>}
            </div>

            {/* Image */}
            <div className="form-group">
              <label className="form-label">Featured Image (JPG, PNG, WEBP — max 10MB)</label>

              {displayImage && (
                <div style={{ marginBottom: '0.75rem', position: 'relative', display: 'inline-block' }}>
                  <img
                    src={displayImage}
                    alt="Preview"
                    style={{ width: '100%', maxWidth: 400, height: 200, objectFit: 'cover', borderRadius: 'var(--border-radius-lg)', border: '2px solid var(--color-gray-200)' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); if (!imagePreview) setRemoveImage(true); }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 28, height: 28,
                      background: 'rgba(220,38,38,0.9)', color: '#fff',
                      borderRadius: '50%', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-label="Remove image"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <label className="file-upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="file-upload-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="file-upload-text">{imageFile ? imageFile.name : 'Click to upload image'}</div>
                <div className="file-upload-hint">JPG, PNG, WEBP up to 10MB</div>
              </label>
            </div>
          </div>

          <div className="admin-form-footer">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/news')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><Spinner size={16} color="#fff" /> {isEdit ? 'Saving...' : 'Publishing...'}</>
              ) : (
                isEdit ? 'Save Changes' : 'Publish Article'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewsFormPage;
