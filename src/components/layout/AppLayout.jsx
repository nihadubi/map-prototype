import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();
  const isFullscreenRoute = ['/', '/add-pin', '/auth'].includes(location.pathname);

  useEffect(() => {
    document.body.classList.toggle('map-route-body', isFullscreenRoute);

    return () => document.body.classList.remove('map-route-body');
  }, [isFullscreenRoute]);

  return (
    <div className={isFullscreenRoute ? 'app-shell app-shell-map' : 'app-shell'}>
      {isFullscreenRoute ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <main className="container">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
}
