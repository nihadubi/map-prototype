import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/providers/useAuth';

const navItems = [
  { to: '/', label: 'Map' },
  { to: '/?openCreate=1', label: 'Add Pin' },
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
          UndrPin
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
