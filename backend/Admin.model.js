/**
 * Admin Model
 * All database operations related to the admins table.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/database');

const AdminModel = {
  /**
   * Find admin by username
   */
  findByUsername: async (username) => {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ? LIMIT 1',
      [username]
    );
    return rows[0] || null;
  },

  /**
   * Find admin by email
   */
  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find admin by ID (safe: excludes password_hash)
   */
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT id, full_name, username, email, role, created_at, updated_at FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Find admin by ID including password_hash (for password change)
   */
  findByIdWithPassword: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Update last login timestamp
   */
  updateLastLogin: async (id) => {
    await pool.execute(
      'UPDATE admins SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  },

  /**
   * Update admin password
   */
  updatePassword: async (id, passwordHash) => {
    const [result] = await pool.execute(
      'UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Update admin profile
   */
  updateProfile: async (id, { full_name, email }) => {
    const [result] = await pool.execute(
      'UPDATE admins SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, email, id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = AdminModel;
