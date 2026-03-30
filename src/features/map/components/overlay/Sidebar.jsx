import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 'discover', label: 'Discover', icon: 'explore', active: true },
  { id: 'events', label: 'Events', icon: 'event_note' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
  { id: 'collections', label: 'Collections', icon: 'layers' },
];

export function Sidebar({ isOpen, onClose, isAuthenticated }) {
  return (
    <>
      <div
        className={`map-sidebar-backdrop ${isOpen ? 'is-open' : ''}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`map-sidebar ${isOpen ? 'is-open' : ''}`.trim()} aria-label="Primary navigation">
        <div className="map-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`map-sidebar-link ${item.active ? 'is-active' : ''}`.trim()}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <NavLink className="map-sidebar-cta" to={isAuthenticated ? '/add-pin' : '/auth'} onClick={onClose}>
            {isAuthenticated ? 'Post Event' : 'Sign In To Post'}
          </NavLink>
        </div>

        <div className="map-sidebar-footer">
          <button type="button" className="map-sidebar-link">
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            <span>Settings</span>
          </button>
          <button type="button" className="map-sidebar-link">
            <span className="material-symbols-outlined" aria-hidden="true">help_outline</span>
            <span>Help</span>
          </button>
        </div>
      </aside>
    </>
  );
}
