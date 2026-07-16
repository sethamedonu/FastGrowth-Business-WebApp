const rules = {
  required: v => v.trim() !== '' || 'This field is required',
  email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
  minLen:   n => v => v.length >= n || `Minimum ${n} characters required`,
  phone:    v => /^\+?[\d\s\-()]{7,}$/.test(v) || 'Enter a valid phone number',
};

function validateField(input, fieldRules) {
  const msg = input.closest('.form-group')?.querySelector('.error-msg');
  for (const rule of fieldRules) {
    const result = rule(input.value);
    if (result !== true) {
      input.classList.add('error');
      if (msg) { msg.textContent = result; msg.classList.add('show'); }
      return false;
    }
  }
  input.classList.remove('error');
  if (msg) msg.classList.remove('show');
  return true;
}

function validateForm(form, schema) {
  let valid = true;
  for (const [name, fieldRules] of Object.entries(schema)) {
    const input = form.querySelector(`[name="${name}"]`);
    if (input && !validateField(input, fieldRules)) valid = false;
  }
  return valid;
}

// Live validation
document.querySelectorAll('.form-control').forEach(input => {
  input.addEventListener('blur', () => {
    if (input.classList.contains('error')) {
      const msg = input.closest('.form-group')?.querySelector('.error-msg');
      if (input.value.trim()) { input.classList.remove('error'); msg?.classList.remove('show'); }
    }
  });
});

export { rules, validateField, validateForm };
