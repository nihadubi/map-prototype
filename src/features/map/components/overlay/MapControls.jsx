export function MapControls({ onLocate, onZoomIn, onZoomOut }) {
  return (
    <>
      <div className="map-zoom-controls" aria-label="Map zoom controls">
        <div className="map-zoom-stack">
          <button type="button" className="map-zoom-button" onClick={onZoomIn} aria-label="Zoom in">
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
          </button>
          <div className="map-zoom-divider" />
          <button type="button" className="map-zoom-button" onClick={onZoomOut} aria-label="Zoom out">
            <span className="material-symbols-outlined" aria-hidden="true">remove</span>
          </button>
        </div>
        <button type="button" className="map-floating-button map-floating-locate" onClick={onLocate} aria-label="Go to my location">
          <span className="material-symbols-outlined" aria-hidden="true">my_location</span>
        </button>
      </div>
    </>
  );
}
