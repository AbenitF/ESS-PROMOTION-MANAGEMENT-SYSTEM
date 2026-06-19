/**

 * News Model

 * All database operations for the news table.

 */



const { pool } = require('../config/database');



const NewsModel = {

  /**

   * Get all news with optional search and pagination

   */

  findAll: async ({ search = '', page = 1, limit = 10 } = {}) => {

    const pageNum  = parseInt(page,  10) || 1;

    const limitNum = parseInt(limit, 10) || 10;

    const offset   = (pageNum - 1) * limitNum;



    let where  = 'WHERE 1=1';

    const countParams = [];

    const dataParams  = [];



    if (search) {

      where += ' AND (title LIKE ? OR content LIKE ?)';

      countParams.push(`%${search}%`, `%${search}%`);

      dataParams.push(`%${search}%`, `%${search}%`);

    }



    const countQuery = `SELECT COUNT(*) as total FROM news ${where}`;

    const dataQuery  = `SELECT * FROM news ${where} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;



    const [[{ total }]] = await pool.execute(countQuery, countParams);

    const [rows]        = await pool.execute(dataQuery,  dataParams);



    return {

      news: rows,

      pagination: {

        total:      parseInt(total, 10),

        page:       pageNum,

        limit:      limitNum,

        totalPages: Math.ceil(total / limitNum) || 1,

      },

    };

  },



  /**

   * Get single news article by ID

   */

  findById: async (id) => {

    const [rows] = await pool.execute(

      'SELECT * FROM news WHERE id = ? LIMIT 1',

      [parseInt(id, 10)]

    );

    return rows[0] || null;

  },



  /**

   * Create a news article

   */

  create: async ({ title, content, image_path }) => {

    const [result] = await pool.execute(

      'INSERT INTO news (title, content, image_path) VALUES (?, ?, ?)',

      [title, content, image_path || null]

    );

    return result.insertId;

  },



  /**

   * Update a news article

   */

  update: async (id, { title, content, image_path }) => {

    const [result] = await pool.execute(

      `UPDATE news SET title = ?, content = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,

      [title, content, image_path !== undefined ? image_path : null, parseInt(id, 10)]

    );

    return result.affectedRows > 0;

  },



  /**

   * Delete a news article

   */

  delete: async (id) => {

    const [result] = await pool.execute(

      'DELETE FROM news WHERE id = ?',

      [parseInt(id, 10)]

    );

    return result.affectedRows > 0;

  },



  /**

   * Get total news count for dashboard

   */

  getCount: async () => {

    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM news');

    return parseInt(total, 10);

  },



  /**

   * Get latest N news articles (for public home page)

   */

  getLatest: async (limit = 4) => {

    const limitNum = parseInt(limit, 10) || 4;

    const [rows] = await pool.execute(

      `SELECT * FROM news ORDER BY created_at DESC LIMIT ${limitNum}`

    );

    return rows;

  },

};



module.exports = NewsModel;


