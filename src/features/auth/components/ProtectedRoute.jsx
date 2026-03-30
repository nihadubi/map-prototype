import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <section className="card stack">
        <h1>Checking your session...</h1>
        <p className="muted">We are verifying your login state.</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}
