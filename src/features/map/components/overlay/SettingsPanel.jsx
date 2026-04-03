const experienceItems = [
  {
    key: 'openCreateOnMapClick',
    title: 'Open Create Pin on map click',
    description: 'When you select a location on the map, open the create drawer immediately.',
  },
  {
    key: 'sidebarExpandOnHover',
    title: 'Expand sidebar on hover',
    description: 'Desktop sidebar expands when the pointer moves over it.',
  },
  {
    key: 'animatePreviewPin',
    title: 'Animate selected location pin',
    description: 'Keep the placement marker softly pulsing while a location is selected.',
  },
];

function SettingsToggle({ title, description, checked, onChange }) {
  return (
    <label className="map-settings-item">
      <div className="map-settings-copy">
        <span className="map-settings-item-title">{title}</span>
        <span className="map-settings-item-description">{description}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`map-settings-toggle ${checked ? 'is-active' : ''}`.trim()}
        onClick={onChange}
      >
        <span className="map-settings-toggle-thumb" />
      </button>
    </label>
  );
}

export function SettingsPanel({
  isOpen,
  settings,
  onToggle,
  onClose,
}) {
  return (
    <>
      <div
        className={`map-settings-backdrop ${isOpen ? 'is-open' : ''}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`map-settings-panel ${isOpen ? 'is-open' : ''}`.trim()} aria-label="Settings">
        <div className="map-settings-header">
          <div>
            <p className="map-settings-kicker">UndrPin Settings</p>
            <h2>Experience</h2>
          </div>
          <button
            type="button"
            className="map-card-icon-button"
            aria-label="Close settings"
            onClick={onClose}
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="map-settings-body">
          <section className="map-settings-section">
            <div className="map-settings-section-header">
              <p className="map-settings-section-kicker">Experience</p>
              <p className="map-settings-section-note">Map and interaction preferences</p>
            </div>

            <div className="map-settings-group">
              {experienceItems.map((item) => (
                <SettingsToggle
                  key={item.key}
                  title={item.title}
                  description={item.description}
                  checked={Boolean(settings[item.key])}
                  onChange={() => onToggle(item.key)}
                />
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
