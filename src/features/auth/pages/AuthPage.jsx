import { useMemo, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { AuthForm } from '../components/AuthForm';

function getAuthErrorMessage(error) {
  if (import.meta.env.DEV && error?.message) {
    return `${error.code || error.status || 'auth/error'}: ${error.message}`;
  }

  switch (error?.code) {
    case 'auth/email-already-in-use':
    case 'user_already_exists':
      return 'This email is already in use.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'invalid_credentials':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
    case 'email_address_invalid':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
    case 'weak_password':
      return 'Password should be at least 6 characters.';
    case 'auth/email-not-confirmed':
    case 'email_not_confirmed':
      return 'Check your email and confirm your account before logging in.';
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Please wait a bit and try again.';
    default:
      if (String(error?.message || '').toLowerCase().includes('supabase auth is not configured')) {
        return 'Authentication is not configured yet. Add the Supabase project keys to continue.';
      }
      return 'Authentication failed. Please try again.';
  }
}

export function AuthPage() {
  const location = useLocation();
  const { user, isAuthenticated, isAuthLoading, signUp, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submitInFlightRef = useRef(false);

  const redirectTo = useMemo(() => location.state?.from || '/', [location.state]);

  async function handleSubmit(values) {
    if (submitInFlightRef.current) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    submitInFlightRef.current = true;

    console.info('[UndrPin Auth] submitting mode:', mode);

    try {
      if (mode === 'signup') {
        await signUp(values);
      } else {
        await login(values);
      }
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0e14] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(202,152,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,81,250,0.12),transparent_30%),linear-gradient(180deg,#0a0e14_0%,#090d14_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_30rem]">
          <section className="hidden lg:grid">
            <div className="max-w-2xl">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
                <span className="material-symbols-outlined text-[1.9rem] text-[#ca98ff]" aria-hidden="true">layers</span>
                <div>
                  <h1 className="font-headline text-3xl font-extrabold tracking-[-0.04em] text-slate-50">UndrPin</h1>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">The Digital Curator</p>
                </div>
              </div>

              <div className="space-y-6">
                <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.24em] text-violet-300">
                  City Access
                </span>
                <div className="space-y-4">
                  <h2 className="max-w-2xl font-headline text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] text-slate-50">
                    Join the people mapping Baku together
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-slate-400">
                    Sign in to curate places, publish live events, and keep your city gallery personal, synced, and ready from any device.
                  </p>
                </div>

                <div className="grid max-w-lg gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.35rem] bg-white/[0.03] p-4 backdrop-blur-xl">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">Protected</p>
                    <p className="mt-2 text-sm font-semibold text-slate-100">Create Pin route</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-white/[0.03] p-4 backdrop-blur-xl">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">Session</p>
                    <p className="mt-2 text-sm font-semibold text-slate-100">Persistent login</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-white/[0.03] p-4 backdrop-blur-xl">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">Status</p>
                    <p className="mt-2 text-sm font-semibold text-slate-100">
                      {isAuthLoading ? 'Checking session' : user ? (user.email || 'Signed in') : 'Guest browsing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <div className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[2rem] text-[#ca98ff]" aria-hidden="true">layers</span>
                <h1 className="font-headline text-3xl font-extrabold tracking-[-0.04em] text-slate-50">UndrPin</h1>
              </div>
              <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">The Digital Curator</p>
            </div>

            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-[#ca98ff] to-[#c185ff] text-[#230023] shadow-[0_12px_30px_rgba(202,152,255,0.24)]'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
                onClick={() => setMode('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-[#ca98ff] to-[#c185ff] text-[#230023] shadow-[0_12px_30px_rgba(202,152,255,0.24)]'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </div>

            <AuthForm
              key={mode}
              mode={mode}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />

            <p className="mt-6 text-center text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                className="ml-2 font-bold text-[#ca98ff] transition hover:text-[#e0bdff]"
                onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
              >
                {mode === 'login' ? 'Sign up for free' : 'Log in instead'}
              </button>
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}
