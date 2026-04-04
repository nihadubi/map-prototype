import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();
  const isMapFullscreenRoute = ['/', '/add-pin'].includes(location.pathname);
  const shellClassName = isMapFullscreenRoute ? 'app-shell app-shell-map' : 'app-shell';

  useEffect(() => {
    document.body.classList.toggle('map-route-body', isMapFullscreenRoute);

    return () => document.body.classList.remove('map-route-body');
  }, [isMapFullscreenRoute]);

  return (
    <div className={shellClassName}>
      {isMapFullscreenRoute ? (
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
