import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

const MapPage = lazy(() =>
  import('../features/map/pages/MapPage').then((module) => ({ default: module.MapPage }))
);
const AuthPage = lazy(() =>
  import('../features/auth/pages/AuthPage').then((module) => ({ default: module.AuthPage }))
);
const LandingPage = lazy(() =>
  import('../pages/LandingPage').then((module) => ({ default: module.LandingPage }))
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

function RootRoute() {
  const location = useLocation();
  const search = location.search || '';
  const params = new URLSearchParams(search);
  const hasLegacyAppIntent = ['openCreate', 'createdPinId', 'lat', 'lng'].some((key) => params.has(key));

  if (hasLegacyAppIntent) {
    return <Navigate to={`/app${search}`} replace />;
  }

  return <LandingPage />;
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppLayout />}>
          <Route path="/app" element={<MapPage />} />
          <Route
            path="/add-pin"
            element={
              <ProtectedRoute>
                <Navigate to="/app?openCreate=1" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
