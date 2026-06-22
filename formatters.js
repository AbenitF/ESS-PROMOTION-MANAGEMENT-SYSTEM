/**
 * Formatter Utilities
 * Date formatting, text truncation, and other UI helpers.
 */

/**
 * Format a date string to a readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString('en-ET', defaultOptions);
};

/**
 * Format date as short (e.g. "Jun 9, 2026")
 */
export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text to a given length.
 */
export const truncate = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

/**
 * Check if a deadline has passed.
 */
export const isExpired = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

/**
 * Get days remaining until deadline.
 */
export const daysRemaining = (deadline) => {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
};

/**
 * Get initials from a full name.
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Extract error message from axios error.
 */
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred.'
  );
};
