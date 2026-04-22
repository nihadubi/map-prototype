import { useMemo, useState } from 'react';
import { AuthField } from './AuthField';
import { validateAuthForm } from '../utils/authValidation';

const initialForm = {
  displayName: '',
  email: '',
  password: '',
};

export function AuthForm({ mode, onSubmit, isSubmitting, submitError }) {
  const [formValues, setFormValues] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateAuthForm({
      mode,
      displayName: formValues.displayName,
      email: formValues.email,
      password: formValues.password,
    });

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    await onSubmit({
      displayName: formValues.displayName.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
    });
  }

  return (
    <div className="w-full rounded-[1.75rem] border border-white/10 bg-[rgba(27,32,40,0.6)] p-8 shadow-[0_30px_100px_rgba(2,6,23,0.5),0_0_60px_rgba(202,152,255,0.08)] backdrop-blur-2xl">
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-50">{formTitle}</h2>
        <p className="mt-1 text-sm text-slate-400">{helperText}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <AuthField
            id="displayName"
            name="displayName"
            label="Display Name"
            placeholder="Your name…"
            value={formValues.displayName}
            onChange={handleChange}
            disabled={isSubmitting}
            icon="badge"
            error={fieldErrors.displayName}
            autoComplete="name"
          />
        ) : null}

        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="curator@undrpin.com"
          value={formValues.email}
          onChange={handleChange}
          disabled={isSubmitting}
          icon="mail"
          error={fieldErrors.email}
          autoComplete="email"
        />

        <AuthField
          id="password"
          name="password"
          type={isPasswordVisible ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password…"
          value={formValues.password}
          onChange={handleChange}
          disabled={isSubmitting}
          icon="lock"
          error={fieldErrors.password}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          trailing={(
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
              onClick={() => setIsPasswordVisible((current) => !current)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-[1.2rem]" aria-hidden="true">
                {isPasswordVisible ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        />

        {submitError ? (
          <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ca98ff] to-[#c185ff] text-sm font-extrabold tracking-[0.08em] text-[#230023] shadow-[0_18px_40px_rgba(202,152,255,0.24)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_48px_rgba(202,152,255,0.34)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#46007d]/30 border-t-[#46007d]" />
              <span>Please wait…</span>
            </>
          ) : (
            <span>{isSignup ? 'Create account' : 'Log in'}</span>
          )}
        </button>
      </form>

    </div>
  );
}
