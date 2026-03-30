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

export function PinCard({ pin, onDirectionsClick, onShareClick }) {
  if (!pin) {
    return null;
  }

  const categoryLabel = pin.category || (pin.type === 'event' ? 'Live Event' : 'City Favorite');
  const typeLabel = pin.type === 'event' ? 'Community Event' : 'Local Spot';

  return (
    <section className="map-pin-card-wrapper">
      <article className="map-pin-card">
        <div className="map-pin-card-cover">
          <div className="map-pin-card-cover-badge">{pin.status === 'active' ? 'LIVE NOW' : 'CURATED PICK'}</div>
          <div className="map-pin-card-cover-content">
            <span className="map-pin-card-kicker">{typeLabel}</span>
            <h2>{pin.title}</h2>
            <p>{pin.description}</p>
          </div>
        </div>

        <div className="map-pin-card-body">
          <div className="map-pin-card-row">
            <div>
              <div className="map-rating-row">
                <span className="material-symbols-outlined filled" aria-hidden="true">star</span>
                <span>4.9</span>
              </div>
              <span className="map-pin-distance">{getPinDistance(pin)}</span>
            </div>
            <button type="button" className="map-card-icon-button" aria-label="Save pin">
              <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
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
