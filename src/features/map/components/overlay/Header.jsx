function AuthActions({ isAuthLoading, isAuthenticated, user, onLoginClick, onLogoutClick }) {
  if (isAuthLoading) {
    return <span className="map-user-label">Checking session...</span>;
  }

  if (isAuthenticated) {
    return (
      <div className="map-header-authenticated">
        <div className="map-avatar" aria-hidden="true">
          {(user?.displayName || user?.email || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div className="map-user-meta">
          <span className="map-user-label">{user?.displayName || user?.email}</span>
          <button type="button" className="map-text-action" onClick={onLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="map-icon-button map-login-button" onClick={onLoginClick}>
      <span className="material-symbols-outlined" aria-hidden="true">login</span>
      <span>Log in</span>
    </button>
  );
}

export function Header({
  query,
  onQueryChange,
  isSidebarOpen,
  onMenuClick,
  onFilterClick,
  isAuthLoading,
  isAuthenticated,
  user,
  onLoginClick,
  onLogoutClick,
}) {
  return (
    <header className="map-header">
      <div className="map-header-inner">
        <div className="map-header-leading">
          <button
            type="button"
            className="map-icon-button map-mobile-only"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isSidebarOpen}
          >
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </button>

          <div className="map-brand">Urban Curator</div>
        </div>

        <label className="map-search" aria-label="Search pins">
          <span className="material-symbols-outlined" aria-hidden="true">search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search hidden gems, events, or categories..."
          />
        </label>

        <div className="map-header-actions">
          <button type="button" className="map-icon-button map-desktop-only" aria-label="Notifications">
            <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
          </button>
          <button type="button" className="map-icon-button" aria-label="Toggle filters" onClick={onFilterClick}>
            <span className="material-symbols-outlined" aria-hidden="true">tune</span>
          </button>

          <AuthActions
            isAuthLoading={isAuthLoading}
            isAuthenticated={isAuthenticated}
            user={user}
            onLoginClick={onLoginClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </div>
    </header>
  );
}
