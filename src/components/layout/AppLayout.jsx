import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();
  const isMapRoute = location.pathname === '/';

  useEffect(() => {
    document.body.classList.toggle('map-route-body', isMapRoute);

    return () => document.body.classList.remove('map-route-body');
  }, [isMapRoute]);

  return (
    <div className={isMapRoute ? 'app-shell app-shell-map' : 'app-shell'}>
      {isMapRoute ? (
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
