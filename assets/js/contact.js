const form    = document.getElementById('contactForm');
const success = document.getElementById('successAlert');
const error   = document.getElementById('errorAlert');

const schema = {
  name:    [v => v.trim() !== '' || 'Name is required'],
  email:   [v => v.trim() !== '' || 'Email is required', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email'],
  subject: [v => v.trim() !== '' || 'Subject is required'],
  message: [v => v.trim() !== '' || 'Message is required', v => v.trim().length >= 10 || 'Message too short'],
};

function validate() {
  let ok = true;
  for (const [name, fieldRules] of Object.entries(schema)) {
    const input = form.querySelector(`[name="${name}"]`);
    const msg   = input?.closest('.form-group')?.querySelector('.error-msg');
    let fieldOk = true;
    for (const rule of fieldRules) {
      const result = rule(input.value);
      if (result !== true) { input.classList.add('error'); if (msg) { msg.textContent = result; msg.classList.add('show'); } fieldOk = false; break; }
    }
    if (fieldOk) { input?.classList.remove('error'); msg?.classList.remove('show'); }
    if (!fieldOk) ok = false;
  }
  return ok;
}

form?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Sending…';

  try {
    await api.contact({
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      subject: form.subject.value.trim(),
      service: form.service?.value || '',
      message: form.message.value.trim(),
    });
    success?.classList.add('show');
    error?.classList.remove('show');
    form.reset();
    setTimeout(() => success?.classList.remove('show'), 5000);
  } catch (err) {
    error.querySelector
      ? (error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${err.message}`)
      : null;
    error?.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
});
