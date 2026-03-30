function getPinBadge(pin) {
  if (pin.type === 'event') {
    return pin.eventDate ? `Event ${pin.eventDate}` : 'Upcoming Event';
  }

  return pin.placeType || pin.category || 'Hidden Gem';
}

function getPinDistance(pin) {
  const lat = Number(pin.lat || pin.coordinates?.[0] || 0);
  const lng = Number(pin.lng || pin.coordinates?.[1] || 0);
  const latDelta = Math.abs(lat - 40.4093) * 111;
  const lngDelta = Math.abs(lng - 49.8671) * 85;
  return `${Math.max(0.2, Math.sqrt((latDelta ** 2) + (lngDelta ** 2))).toFixed(1)} km away`;
}

function formatCoordinate(value) {
  return Number(value || 0).toFixed(3);
}

function getStatusLabel(pin) {
  return pin.status === 'active' ? 'ACTIVE' : 'CURATED';
}

function getStatusTone(pin) {
  return pin.status === 'active' ? 'map-status-live' : 'map-status-muted';
}

export function PinCard({
  pin,
  isSaved,
  isExpanded,
  onToggleExpanded,
  onDirectionsClick,
  onShareClick,
  onToggleSaved,
}) {
  if (!pin) {
    return null;
  }

  const categoryLabel = pin.category || (pin.type === 'event' ? 'Live Event' : 'City Favorite');
  const typeLabel = pin.type === 'event' ? 'Community Event' : 'Local Spot';
  const cityLabel = pin.city ? pin.city.toUpperCase() : 'BAKU';
  const coordinateLabel = `${formatCoordinate(pin.lat || pin.coordinates?.[0])}, ${formatCoordinate(pin.lng || pin.coordinates?.[1])}`;
  const detailItems = pin.type === 'event'
    ? [
        { label: 'Date', value: pin.eventDate || 'TBD' },
        { label: 'Starts', value: pin.startTime || 'Not set' },
        { label: 'Format', value: 'Community Event' },
      ]
    : [
        { label: 'Place Type', value: pin.placeType || 'General' },
        { label: 'Category', value: pin.category || 'General' },
        { label: 'Area', value: cityLabel },
      ];

  return (
    <section className={`map-pin-card-wrapper ${isExpanded ? 'is-expanded' : 'is-collapsed'}`.trim()}>
      <article className="map-pin-card">
        <button
          type="button"
          className="map-pin-card-handle"
          onClick={onToggleExpanded}
          aria-label={isExpanded ? 'Collapse pin details' : 'Expand pin details'}
        >
          <span className="map-pin-card-grip" />
        </button>

        <div className="map-pin-card-cover">
          <div className="map-pin-card-cover-badge">{pin.type === 'event' ? 'EVENT PICK' : 'LOCAL PICK'}</div>
          <div className="map-pin-card-cover-content">
            <span className="map-pin-card-kicker">{typeLabel}</span>
            <h2>{pin.title}</h2>
            <p>{pin.description}</p>
          </div>
        </div>

        <div className="map-pin-card-body">
          <div className="map-pin-card-row">
            <div>
              <div className="map-status-row">
                <span className={`map-status-dot ${getStatusTone(pin)}`.trim()} />
                <span>{getStatusLabel(pin)}</span>
              </div>
              <span className="map-pin-distance">{getPinDistance(pin)}</span>
            </div>
            <button
              type="button"
              className={`map-card-icon-button ${isSaved ? 'is-saved' : ''}`.trim()}
              aria-label={isSaved ? 'Remove saved pin' : 'Save pin'}
              onClick={onToggleSaved}
            >
              <span className="material-symbols-outlined filled" aria-hidden="true">favorite</span>
            </button>
          </div>

          <div className="map-pin-tag-row">
            <span className="map-pin-tag map-pin-tag-tertiary">{categoryLabel}</span>
            <span className="map-pin-tag map-pin-tag-primary">{getPinBadge(pin)}</span>
          </div>

          <div className="map-pin-meta">
            <span>By {pin.createdBy || 'Community member'}</span>
            <span>{pin.createdAtLabel || 'Just added'}</span>
          </div>

          <div className="map-pin-card-expandable">
            <dl className="map-pin-details-grid">
              {detailItems.map((item) => (
                <div key={item.label} className="map-pin-detail-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="map-pin-location-row">
              <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
              <span>{cityLabel}</span>
              <span className="map-pin-location-separator">&bull;</span>
              <span>{coordinateLabel}</span>
            </div>
          </div>

          <div className="map-pin-card-actions">
            <button type="button" className="map-primary-button" onClick={onDirectionsClick}>
              Get Directions
            </button>
            <button type="button" className="map-card-icon-button" onClick={onShareClick} aria-label="Share pin">
              <span className="material-symbols-outlined" aria-hidden="true">share</span>
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
