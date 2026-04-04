function AuthActions({ isAuthLoading, isAuthenticated, user, onLoginClick, onLogoutClick }) {
  if (isAuthLoading) {
    return <span className="map-user-label">Checking session…</span>;
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

          <div className="map-brand">UndrPin</div>
        </div>

        <label className="map-search" aria-label="Search pins">
          <span className="material-symbols-outlined" aria-hidden="true">search</span>
          <input
            type="search"
            name="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search places, events, or categories…"
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        <div className="map-header-actions">
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
