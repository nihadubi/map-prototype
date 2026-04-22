function formatCoordinate(value) {
  return Number(value || 0).toFixed(3);
}

function formatEventDate(value) {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
}

function getPinSummary(pin) {
  if (pin.type === 'event') {
    const eventDateLabel = formatEventDate(pin.eventDate);
    return eventDateLabel ? `Event on ${eventDateLabel}` : 'Community event';
  }

  return pin.category ? `${pin.category} place` : 'Community place';
}

export function PinCard({
  pin,
  isSaved,
  isOwner = false,
  isExpanded,
  isArchivePending = false,
  onToggleExpanded,
  onDirectionsClick,
  onShareClick,
  onToggleSaved,
  onEditPin,
  onArchivePin,
}) {
  if (!pin) {
    return null;
  }

  const categoryLabel = pin.category || (pin.type === 'event' ? 'Live Event' : 'City Favorite');
  const typeLabel = pin.type === 'event' ? 'Event' : 'Place';
  const cityLabel = pin.city ? pin.city.toUpperCase() : 'BAKU';
  const eventDateLabel = formatEventDate(pin.eventDate);
  const coordinateLabel = `${formatCoordinate(pin.lat || pin.coordinates?.[0])}, ${formatCoordinate(pin.lng || pin.coordinates?.[1])}`;
  const detailItems = [
    { label: 'Category', value: pin.category || 'General' },
    { label: 'Created By', value: pin.createdBy || 'Community member' },
    ...(pin.type === 'event'
      ? [
          { label: 'Event Date', value: eventDateLabel || 'TBD' },
          { label: 'Start Time', value: pin.startTime || 'Not set' },
        ]
      : [{ label: 'Pin Type', value: 'Place' }]),
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
          <div className="map-pin-card-cover-badge">{pin.type === 'event' ? 'LIVE EVENT' : 'CITY PIN'}</div>
          <div className="map-pin-card-cover-content">
            <span className="map-pin-card-kicker">{typeLabel}</span>
            <h2>{pin.title}</h2>
            <p>{coordinateLabel}</p>
          </div>
        </div>

        <div className="map-pin-card-body">
          <div className="map-pin-card-row">
            <div>
              <div className="map-status-row">
                <span className="map-status-dot map-status-live" />
                <span>{categoryLabel}</span>
              </div>
              <span className="map-pin-distance">{getPinSummary(pin)}</span>
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
            <span className="map-pin-tag map-pin-tag-secondary">{cityLabel}</span>
            {pin.type === 'event' && eventDateLabel ? <span className="map-pin-tag map-pin-tag-primary">{eventDateLabel}</span> : null}
          </div>

          <p className="map-pin-description">{pin.description || 'No description added yet.'}</p>

          {isOwner ? (
            <div className="map-pin-owner-actions">
              <button type="button" className="map-secondary-button" onClick={onEditPin}>
                Edit Pin
              </button>
              <button
                type="button"
                className="map-secondary-button map-secondary-button-danger"
                onClick={onArchivePin}
                disabled={isArchivePending}
              >
                {isArchivePending ? 'Archiving...' : 'Archive Pin'}
              </button>
            </div>
          ) : null}

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
              <span>{pin.createdAtLabel || 'Just added'}</span>
            </div>
          </div>

          <div className="map-pin-card-actions">
            <button type="button" className="map-primary-button" onClick={onDirectionsClick}>
              Open Directions
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
