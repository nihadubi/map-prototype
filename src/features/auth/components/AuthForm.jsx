import { useMemo, useState } from 'react';

const initialForm = {
  displayName: '',
  email: '',
  password: '',
};

export function AuthForm({ mode, onSubmit, isSubmitting, submitError }) {
  const [formValues, setFormValues] = useState(initialForm);
  const isSignup = mode === 'signup';

  const formTitle = useMemo(
    () => (isSignup ? 'Create your account' : 'Welcome back'),
    [isSignup]
  );

  const helperText = useMemo(
    () =>
      isSignup
        ? 'Create an account to add event and place pins.'
        : 'Log in to continue contributing to the city map.',
    [isSignup]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    await onSubmit({
      displayName: formValues.displayName.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
    });
  }

  return (
    <form className="card stack auth-form" onSubmit={handleSubmit}>
      <div className="stack-sm">
        <h2 className="section-title">{formTitle}</h2>
        <p className="muted">{helperText}</p>
      </div>

      {isSignup ? (
        <label className="stack-sm" htmlFor="displayName">
          <span>Name</span>
          <input
            id="displayName"
            name="displayName"
            type="text"
            placeholder="Your name"
            value={formValues.displayName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>
      ) : null}

      <label className="stack-sm" htmlFor="email">
        <span>Email</span>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formValues.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </label>

      <label className="stack-sm" htmlFor="password">
        <span>Password</span>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          value={formValues.password}
          onChange={handleChange}
          disabled={isSubmitting}
          minLength={6}
          required
        />
      </label>

      {submitError ? <p className="form-error">{submitError}</p> : null}

      <button type="submit" className="button-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
      </button>
    </form>
  );
}
