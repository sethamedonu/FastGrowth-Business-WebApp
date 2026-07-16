require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── Security & Parsing ──
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Rate Limiting ──
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
}));

// Stricter limit on auth
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts' },
}));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/posts',     require('./routes/posts'));
app.use('/api/uploads',   require('./routes/uploads'));

// ── Error Handling ──
app.use(notFound);
app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FastGrowth API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
