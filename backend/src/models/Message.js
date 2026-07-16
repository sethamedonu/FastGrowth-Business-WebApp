const db = require('../config/db');

const Message = {
  async findAll({ status, limit = 50, offset = 0 } = {}) {
    const conditions = status ? 'WHERE status = $1' : '';
    const params     = status ? [status, limit, offset] : [limit, offset];
    const limitIdx   = status ? '$2' : '$1';
    const offsetIdx  = status ? '$3' : '$2';

    const { rows } = await db.query(
      `SELECT * FROM messages ${conditions}
       ORDER BY created_at DESC
       LIMIT ${limitIdx} OFFSET ${offsetIdx}`,
      params
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM messages WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ name, email, subject, service, message }) {
    const { rows } = await db.query(
      `INSERT INTO messages (name, email, subject, service, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email.toLowerCase(), subject, service, message]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE messages SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM messages WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM messages');
    return parseInt(rows[0].count);
  },
};

module.exports = Message;
