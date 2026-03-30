function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateAuthForm({ mode, displayName, email, password }) {
  const errors = {};

  if (mode === 'signup' && !displayName.trim()) {
    errors.displayName = 'Please enter your name.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (mode === 'signup' && password.length < 6) {
    errors.password = 'Password should be at least 6 characters.';
  }

  return errors;
}
