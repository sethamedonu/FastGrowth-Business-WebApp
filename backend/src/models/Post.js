const db = require('../config/db');

const Post = {
  async findAll({ status, limit = 20, offset = 0 } = {}) {
    const conditions = status ? 'WHERE p.status = $1' : '';
    const params     = status ? [status, limit, offset] : [limit, offset];
    const limitIdx   = status ? '$2' : '$1';
    const offsetIdx  = status ? '$3' : '$2';

    const { rows } = await db.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       ${conditions}
       ORDER BY p.created_at DESC
       LIMIT ${limitIdx} OFFSET ${offsetIdx}`,
      params
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ title, category, content, author_id, status = 'draft' }) {
    const { rows } = await db.query(
      `INSERT INTO posts (title, category, content, author_id, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, category, content, author_id, status]
    );
    return rows[0];
  },

  async update(id, { title, category, content, status }) {
    const { rows } = await db.query(
      `UPDATE posts SET
         title      = COALESCE($1, title),
         category   = COALESCE($2, category),
         content    = COALESCE($3, content),
         status     = COALESCE($4, status),
         updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, category, content, status, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM posts');
    return parseInt(rows[0].count);
  },
};

module.exports = Post;
