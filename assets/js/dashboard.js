// ── Auth guard — runs on every dashboard page ──
requireAuth();
populateTopbar();

// ── Sidebar toggle (mobile) ──
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

// ── Active sidebar link ──
const currentFile = location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-link').forEach(a => {
  if (a.getAttribute('href') === currentFile) a.classList.add('active');
});

// ── Logout ──
document.querySelectorAll('.logout-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    Auth.clear();
    window.location.href = '../login.html';
  });
});

// ── Toast ──
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `alert alert-${type} show`;
  t.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;min-width:280px;box-shadow:var(--shadow-lg);';
  t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Confirm modal (replaces native confirm()) ──
function confirmAction(message) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;max-width:400px;width:90%;box-shadow:var(--shadow-lg);">
        <h3 style="margin-bottom:0.75rem;font-size:var(--text-lg);">Confirm Action</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;">${message}</p>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <button id="confirmCancel" class="btn btn-outline btn-sm">Cancel</button>
          <button id="confirmOk" class="btn btn-danger btn-sm">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmOk').onclick     = () => { overlay.remove(); resolve(true); };
    overlay.querySelector('#confirmCancel').onclick = () => { overlay.remove(); resolve(false); };
  });
}

window.showToast     = showToast;
window.confirmAction = confirmAction;
