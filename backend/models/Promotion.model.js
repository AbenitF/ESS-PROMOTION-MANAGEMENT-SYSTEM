/**
 * Promotion Model
 * All database operations for the promotions table.
 */

const { pool } = require('../config/database');

const PromotionModel = {
  /**
   * Get all promotions with optional search and filtering
   */
  findAll: async ({ search = '', department = '', status = '', page = 1, limit = 10 } = {}) => {
    const pageNum  = parseInt(page,  10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset   = (pageNum - 1) * limitNum;

    const countParams = [];
    const dataParams  = [];
    let where = 'WHERE 1=1';

    if (search) {
      where += ' AND (title LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
      dataParams.push(`%${search}%`, `%${search}%`);
    }
    if (department) {
      where += ' AND department = ?';
      countParams.push(department);
      dataParams.push(department);
    }
    if (status) {
      where += ' AND status = ?';
      countParams.push(status);
      dataParams.push(status);
    }

    const countQuery = `SELECT COUNT(*) as total FROM promotions ${where}`;
    const dataQuery  = `SELECT * FROM promotions ${where} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [[{ total }]] = await pool.execute(countQuery, countParams);
    const [rows]        = await pool.execute(dataQuery,  dataParams);

    return {
      promotions: rows,
      pagination: {
        total:      parseInt(total, 10),
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  },

  /**
   * Get single promotion by ID
   */
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM promotions WHERE id = ? LIMIT 1',
      [parseInt(id, 10)]
    );
    return rows[0] || null;
  },

  /**
   * Create a new promotion
   */
  create: async ({ title, department, description, requirements, attachment_path, publish_date, deadline, status }) => {
    const [result] = await pool.execute(
      `INSERT INTO promotions
        (title, department, description, requirements, attachment_path, publish_date, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        department,
        description,
        requirements  || null,
        attachment_path || null,
        publish_date,
        deadline      || null,
        status        || 'active',
      ]
    );
    return result.insertId;
  },

  /**
   * Update a promotion
   */
  update: async (id, { title, department, description, requirements, attachment_path, publish_date, deadline, status }) => {
    const [result] = await pool.execute(
      `UPDATE promotions SET
        title = ?, department = ?, description = ?, requirements = ?,
        attachment_path = ?, publish_date = ?, deadline = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        department,
        description,
        requirements   || null,
        attachment_path !== undefined ? attachment_path : null,
        publish_date,
        deadline       || null,
        status,
        parseInt(id, 10),
      ]
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a promotion
   */
  delete: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM promotions WHERE id = ?',
      [parseInt(id, 10)]
    );
    return result.affectedRows > 0;
  },

  /**
   * Get statistics for admin dashboard
   */
  getStats: async () => {
    const [[{ total }]]   = await pool.execute('SELECT COUNT(*) as total FROM promotions');
    const [[{ active }]]  = await pool.execute("SELECT COUNT(*) as active FROM promotions WHERE status = 'active'");
    const [[{ expired }]] = await pool.execute(
      "SELECT COUNT(*) as expired FROM promotions WHERE status = 'expired' OR (deadline IS NOT NULL AND deadline < CURDATE())"
    );
    return {
      total:   parseInt(total,   10),
      active:  parseInt(active,  10),
      expired: parseInt(expired, 10),
    };
  },

  /**
   * Get distinct departments for filter UI
   */
  getDepartments: async () => {
    const [rows] = await pool.execute(
      'SELECT DISTINCT department FROM promotions WHERE department IS NOT NULL ORDER BY department ASC'
    );
    return rows.map((r) => r.department);
  },

  /**
   * Get latest N active promotions (for public home page)
   */
  getLatest: async (limit = 6) => {
    const limitNum = parseInt(limit, 10) || 6;
    const [rows] = await pool.execute(
      `SELECT * FROM promotions WHERE status = 'active' ORDER BY created_at DESC LIMIT ${limitNum}`
    );
    return rows;
  },
};

module.exports = PromotionModel;
