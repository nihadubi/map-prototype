import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';

const navItems = [
  { to: '/', label: 'Map' },
  { to: '/add-pin', label: 'Add Pin' },
];

export function Header() {
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand-link">
          CityLayer
        </NavLink>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-auth-actions">
          {isAuthLoading ? (
            <span className="muted header-user-label">Checking session...</span>
          ) : isAuthenticated ? (
            <>
              <span className="header-user-label">{user?.displayName || user?.email}</span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="nav-link">
              Log in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
