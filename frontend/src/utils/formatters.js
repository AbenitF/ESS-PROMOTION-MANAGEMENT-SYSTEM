/**
 * formatters.js — Reusable utility functions for Member 2
 * Used across NewsPage, NewsDetailPage, AboutPage, and shared components.
 */

/**
 * Format a date string or Date object into a human-readable string.
 * @param {string|Date} date - The date to format.
 * @param {object} options   - Optional Intl.DateTimeFormat options.
 * @returns {string}         - e.g. "June 22, 2026"
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return 'Invalid date';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return parsed.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date into a shorter form.
 * @param {string|Date} date
 * @returns {string} - e.g. "Jun 22, 2026"
 */
export function formatShortDate(date) {
  return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Truncate a string to a given length and append ellipsis.
 * @param {string} text     - The string to truncate.
 * @param {number} maxLength - Maximum allowed characters (default: 120).
 * @returns {string}
 */
export function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Calculate how many days remain until a deadline.
 * @param {string|Date} deadline - The deadline date.
 * @returns {number|null}
 *   - Positive number → days remaining
 *   - 0               → due today
 *   - Negative number → expired N days ago
 *   - null            → no deadline provided
 */
export function daysRemaining(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  if (isNaN(end.getTime())) return null;

  // Strip time — compare dates only
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffMs = end - now;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Return a human-readable label for daysRemaining() output.
 * @param {string|Date} deadline
 * @returns {string} - e.g. "5 days left", "Expired 2 days ago", "Due today"
 */
export function deadlineLabel(deadline) {
  const days = daysRemaining(deadline);
  if (days === null) return 'No deadline';
  if (days === 0) return 'Due today';
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} left`;
  return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
