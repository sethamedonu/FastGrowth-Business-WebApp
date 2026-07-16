const API_BASE = 'http://localhost:3000/api';
const TOKEN_KEY = 'fg_token';
const USER_KEY  = 'fg_user';

// ── Token helpers ──
const Auth = {
  getToken:  ()        => localStorage.getItem(TOKEN_KEY),
  getUser:   ()        => JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  setSession:(token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear:     ()        => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  isLoggedIn:()        => !!localStorage.getItem(TOKEN_KEY),
};

// ── Core fetch wrapper ──
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Token expired or invalid → redirect to login
  if (res.status === 401) {
    Auth.clear();
    window.location.href = isDashboard() ? '../login.html' : 'login.html';
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function isDashboard() {
  return window.location.pathname.includes('/dashboard/');
}

// ── API methods ──
const api = {
  // Auth
  login:  (email, password) => request('POST', '/auth/login', { email, password }),
  me:     ()                => request('GET',  '/auth/me'),

  // Contact (public)
  contact: (body) => request('POST', '/contact', body),

  // Dashboard
  stats:   ()     => request('GET', '/dashboard/stats'),

  // Messages
  messages: {
    list:         (params = {}) => request('GET', '/messages?' + new URLSearchParams(params)),
    get:          (id)          => request('GET', `/messages/${id}`),
    updateStatus: (id, status)  => request('PUT', `/messages/${id}/status`, { status }),
    delete:       (id)          => request('DELETE', `/messages/${id}`),
  },

  // Users
  users: {
    list:   ()       => request('GET',    '/users'),
    get:    (id)     => request('GET',    `/users/${id}`),
    create: (body)   => request('POST',   '/users', body),
    update: (id, b)  => request('PUT',    `/users/${id}`, b),
    delete: (id)     => request('DELETE', `/users/${id}`),
  },

  // Posts
  posts: {
    list:   (params = {}) => request('GET', '/posts?' + new URLSearchParams(params)),
    get:    (id)          => request('GET', `/posts/${id}`),
    create: (body)        => request('POST',   '/posts', body),
    update: (id, body)    => request('PUT',    `/posts/${id}`, body),
    delete: (id)          => request('DELETE', `/posts/${id}`),
  },

  // Uploads
  presign: (filename, contentType) => request('POST', '/uploads/presign', { filename, contentType }),
};

// ── Auth guard for dashboard pages ──
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = '../login.html';
  }
}

// ── Populate user avatar/name in topbar ──
function populateTopbar() {
  const user = Auth.getUser();
  if (!user) return;
  document.querySelectorAll('.user-avatar').forEach(el => {
    el.textContent = user.name?.charAt(0).toUpperCase() || 'A';
    el.title = user.name;
  });
}

// ── Format date ──
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Status badge HTML ──
function statusBadge(status) {
  const map = {
    new:       'badge-primary',
    pending:   'badge-warning',
    replied:   'badge-success',
    active:    'badge-success',
    inactive:  'badge-danger',
    published: 'badge-success',
    draft:     'badge-warning',
    admin:     'badge-primary',
    editor:    'badge-warning',
  };
  return `<span class="badge ${map[status] || 'badge-primary'}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}
