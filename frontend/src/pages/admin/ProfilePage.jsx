/**
 * Admin Profile Page
 * View profile and change password.
 */

import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Spinner from '../../components/Spinner';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage, getInitials } from '../../utils/formatters';

const ProfilePage = () => {
  const { admin, updateAdmin } = useAuth();
  const { showToast } = useToast();

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: admin?.full_name || '',
    email: admin?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [pwdForm, setPwdForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileForm.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!profileForm.email.trim()) errs.email = 'Email is required.';
    if (profileForm.email && !/\S+@\S+\.\S+/.test(profileForm.email)) errs.email = 'Enter a valid email.';
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(profileForm);
      updateAdmin(res.data.data);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm((prev) => ({ ...prev, [name]: value }));
    if (pwdErrors[name]) setPwdErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwdForm.current_password) errs.current_password = 'Current password is required.';
    if (!pwdForm.new_password) errs.new_password = 'New password is required.';
    if (pwdForm.new_password && pwdForm.new_password.length < 8) errs.new_password = 'Password must be at least 8 characters.';
    if (pwdForm.new_password !== pwdForm.confirm_password) errs.confirm_password = 'Passwords do not match.';
    if (Object.keys(errs).length > 0) { setPwdErrors(errs); return; }

    setPwdLoading(true);
    try {
      await authService.changePassword({
        current_password: pwdForm.current_password,
        new_password: pwdForm.new_password,
      });
      showToast('Password changed successfully.', 'success');
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setPwdLoading(false);
    }
  };

  const togglePwd = (field) => setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }));

  const PwdInput = ({ name, label, field }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={name}
          name={name}
          type={showPwd[field] ? 'text' : 'password'}
          className={`form-control ${pwdErrors[name] ? 'is-error' : ''}`}
          value={pwdForm[name]}
          onChange={handlePwdChange}
          autoComplete={name === 'current_password' ? 'current-password' : 'new-password'}
          style={{ paddingRight: '2.5rem' }}
        />
        <button
          type="button"
          onClick={() => togglePwd(field)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={showPwd[field] ? 'Hide' : 'Show'}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {showPwd[field]
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
            }
          </svg>
        </button>
      </div>
      {pwdErrors[name] && <div className="form-error">{pwdErrors[name]}</div>}
    </div>
  );

  return (
    <AdminLayout title="Profile" subtitle="Manage your account settings">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 960 }}>
        {/* Profile Info */}
        <div>
          {/* Avatar Card */}
          <div className="admin-table-wrapper" style={{ padding: '1.75rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--color-primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: 800, margin: '0 auto 1rem',
            }}>
              {getInitials(admin?.full_name || '')}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-gray-800)', marginBottom: '0.25rem' }}>
              {admin?.full_name}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.75rem' }}>
              {admin?.email}
            </div>
            <span className="badge badge-info">{admin?.role}</span>
          </div>

          {/* Profile Form */}
          <div className="admin-form-wrapper">
            <div className="admin-form-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>Update Profile</h3>
            </div>
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className="admin-form-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="full_name">Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    className={`form-control ${profileErrors.full_name ? 'is-error' : ''}`}
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                  />
                  {profileErrors.full_name && <div className="form-error">{profileErrors.full_name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${profileErrors.email ? 'is-error' : ''}`}
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                  {profileErrors.email && <div className="form-error">{profileErrors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" value={admin?.username || ''} disabled />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: 4 }}>Username cannot be changed.</div>
                </div>
              </div>
              <div className="admin-form-footer">
                <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                  {profileLoading ? <><Spinner size={16} color="#fff" /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="admin-form-wrapper" style={{ height: 'fit-content' }}>
          <div className="admin-form-header">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>Change Password</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
              Use a strong password with uppercase, lowercase, and numbers.
            </p>
          </div>
          <form onSubmit={handlePwdSubmit} noValidate>
            <div className="admin-form-body">
              <PwdInput name="current_password" label="Current Password" field="current" />
              <PwdInput name="new_password" label="New Password" field="new" />
              <PwdInput name="confirm_password" label="Confirm New Password" field="confirm" />
            </div>
            <div className="admin-form-footer">
              <button type="submit" className="btn btn-primary" disabled={pwdLoading}>
                {pwdLoading ? <><Spinner size={16} color="#fff" /> Updating...</> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
