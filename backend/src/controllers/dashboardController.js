const db = require('../config/db');

async function getStats(req, res, next) {
  try {
    const [users, messages, posts] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM messages'),
      db.query('SELECT COUNT(*) FROM posts'),
    ]);

    const newMessages = await db.query(
      "SELECT COUNT(*) FROM messages WHERE status = 'new'"
    );

    res.json({
      success: true,
      data: {
        totalUsers:    parseInt(users.rows[0].count),
        totalMessages: parseInt(messages.rows[0].count),
        newMessages:   parseInt(newMessages.rows[0].count),
        totalPosts:    parseInt(posts.rows[0].count),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
