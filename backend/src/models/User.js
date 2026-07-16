const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async findAll() {
    const { rows } = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return rows[0] || null;
  },

  async create({ name, email, password, role = 'editor' }) {
    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, status, created_at`,
      [name, email.toLowerCase(), password_hash, role]
    );
    return rows[0];
  },

  async update(id, { name, email, role, status }) {
    const { rows } = await db.query(
      `UPDATE users SET
         name   = COALESCE($1, name),
         email  = COALESCE($2, email),
         role   = COALESCE($3, role),
         status = COALESCE($4, status)
       WHERE id = $5
       RETURNING id, name, email, role, status, created_at`,
      [name, email?.toLowerCase(), role, status, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  },
};

module.exports = User;
