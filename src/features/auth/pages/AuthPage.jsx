import { useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { AuthForm } from '../components/AuthForm';

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export function AuthPage() {
  const location = useLocation();
  const { user, isAuthenticated, isAuthLoading, signUp, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const redirectTo = useMemo(() => location.state?.from || '/add-pin', [location.state]);

  async function handleSubmit(values) {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        await signUp(values);
      } else {
        await login(values);
      }
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="auth-page-grid">
      <div className="stack auth-shell">
        <div className="stack-sm">
          <span className="eyebrow">CityLayer access</span>
          <h1>Join the people mapping Baku together</h1>
          <p className="muted">
            Sign up or log in to contribute places and live events. Browsing the map stays open to everyone.
          </p>
        </div>

        <div className="auth-toggle-row" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`chip ${mode === 'login' ? 'chip-active' : ''}`.trim()}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`chip ${mode === 'signup' ? 'chip-active' : ''}`.trim()}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </div>

      <aside className="card auth-side-panel stack-sm">
        <h2 className="section-title">Session status</h2>
        {isAuthLoading ? (
          <p className="muted">Checking auth session...</p>
        ) : user ? (
          <>
            <p className="muted">Signed in as</p>
            <p className="auth-user-email">{user.email}</p>
          </>
        ) : (
          <p className="muted">You are currently browsing as a guest.</p>
        )}

        <div className="stack-sm auth-checklist">
          <span>Protected create-pin route</span>
          <span>Persistent session</span>
          <span>Email/password auth</span>
        </div>
      </aside>
    </section>
  );
}
