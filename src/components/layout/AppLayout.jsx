import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();
  const isMapFullscreenRoute = ['/', '/add-pin'].includes(location.pathname);
  const isAuthFullscreenRoute = location.pathname === '/auth';
  const shellClassName = isMapFullscreenRoute
    ? 'app-shell app-shell-map'
    : isAuthFullscreenRoute
      ? 'app-shell app-shell-fullscreen'
      : 'app-shell';

  useEffect(() => {
    document.body.classList.toggle('map-route-body', isMapFullscreenRoute);

    return () => document.body.classList.remove('map-route-body');
  }, [isMapFullscreenRoute]);

  return (
    <div className={shellClassName}>
      {isMapFullscreenRoute || isAuthFullscreenRoute ? (
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
