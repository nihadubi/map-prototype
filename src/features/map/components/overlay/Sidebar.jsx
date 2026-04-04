const navItems = [
  { id: 'discover', label: 'Discover', icon: 'explore' },
  { id: 'events', label: 'Events', icon: 'map' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
];

export function Sidebar({
  isOpen,
  onClose,
  onCloseAfterSelect,
  onHoverOpen,
  onHoverClose,
  activeSection,
  onSectionChange,
  sectionMeta,
  onSettingsClick,
  onCreatePinClick,
}) {
  return (
    <>
      <div
        className={`map-sidebar-backdrop ${isOpen ? 'is-open' : ''}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`map-sidebar ${isOpen ? 'is-open' : ''}`.trim()}
        aria-label="Primary navigation"
        onMouseEnter={onHoverOpen}
        onMouseLeave={onHoverClose}
      >
        <div className="map-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`map-sidebar-link ${activeSection === item.id ? 'is-active' : ''}`.trim()}
              onClick={() => {
                onSectionChange(item.id);
                onCloseAfterSelect?.();
              }}
            >
              <span className="map-sidebar-icon material-symbols-outlined" aria-hidden="true">{item.icon}</span>
              <span className="map-sidebar-label">{item.label}</span>
              <span className="map-sidebar-meta">{sectionMeta?.[item.id] ?? ''}</span>
            </button>
          ))}
        </div>

        <div className="map-sidebar-footer">
          <button type="button" className="map-sidebar-link" onClick={onSettingsClick}>
            <span className="map-sidebar-icon material-symbols-outlined" aria-hidden="true">settings</span>
            <span className="map-sidebar-label">Settings</span>
          </button>
          <button type="button" className="map-sidebar-link map-sidebar-create-mobile map-sidebar-create-cta" onClick={onCreatePinClick}>
            <span className="map-sidebar-icon material-symbols-outlined" aria-hidden="true">add_location_alt</span>
            <span className="map-sidebar-label">Create Pin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
