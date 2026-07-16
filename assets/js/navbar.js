const navbar  = document.querySelector('.navbar');
const toggle  = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Scroll shadow
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 20));

// Mobile toggle
toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

// Close on link click
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
