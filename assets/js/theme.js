const THEME_KEY = 'fg-theme';
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-icon').forEach(i => {
    i.className = `theme-icon fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
  });
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Init
applyTheme(localStorage.getItem(THEME_KEY) || 'light');
document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
