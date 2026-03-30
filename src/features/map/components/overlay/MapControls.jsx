export function MapControls({ onLocate, onZoomIn, onZoomOut, onToggleSidebar }) {
  return (
    <>
      <div className="map-floating-actions">
        <button type="button" className="map-floating-button" onClick={onLocate} aria-label="Center on Baku">
          <span className="material-symbols-outlined" aria-hidden="true">my_location</span>
        </button>
        <button type="button" className="map-floating-pill" onClick={onToggleSidebar}>
          <span className="material-symbols-outlined" aria-hidden="true">format_list_bulleted</span>
          <span className="map-floating-pill-label">LIST VIEW</span>
        </button>
      </div>

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
      </div>
    </>
  );
}
