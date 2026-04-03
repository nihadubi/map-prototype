import { useMemo } from 'react';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
} from '../../../map/constants/mapConfig';
import { MapCanvas } from '../../../../lib/map/MapCanvas';

const previewMarkerConfig = {
  className: 'add-pin-preview-marker',
  label: '+',
};

export function MapBackground({ selectedCoordinates, onCoordinateSelect, onMapReady }) {
  const previewMarker = useMemo(() => {
    if (!selectedCoordinates) {
      return null;
    }

    return {
      lat: selectedCoordinates.lat,
      lng: selectedCoordinates.lng,
      className: previewMarkerConfig.className,
      label: previewMarkerConfig.label,
    };
  }, [selectedCoordinates]);

  return (
    <>
      <div className="absolute inset-0 z-0 add-pin-map-layer">
        <MapCanvas
          className="mapbox-map"
          initialCenter={MAP_CENTER_BAKU_LNGLAT}
          initialZoom={DEFAULT_MAP_ZOOM}
          maxBounds={AZERBAIJAN_MAX_BOUNDS}
          onMapClick={onCoordinateSelect}
          onMapReady={onMapReady}
          previewMarker={previewMarker}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent add-pin-map-fade" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_25%)]" />
    </>
  );
}
