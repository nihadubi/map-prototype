import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

const MapPage = lazy(() =>
  import('../features/map/pages/MapPage').then((module) => ({ default: module.MapPage }))
);
const AuthPage = lazy(() =>
  import('../features/auth/pages/AuthPage').then((module) => ({ default: module.AuthPage }))
);
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);

function RouteLoadingFallback() {
  return (
    <section className="route-loading-shell">
      <div className="route-loading-card">
        <span className="route-loading-kicker">Loading</span>
        <h1>Preparing the next view...</h1>
        <p>We are loading the map experience and connected tools.</p>
      </div>
    </section>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/add-pin"
            element={
              <ProtectedRoute>
                <Navigate to="/?openCreate=1" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
