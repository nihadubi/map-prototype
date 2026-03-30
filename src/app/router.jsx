import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { MapPage } from '../features/map/pages/MapPage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { AddPinPage } from '../features/pins/pages/AddPinPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/add-pin"
          element={
            <ProtectedRoute>
              <AddPinPage />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
