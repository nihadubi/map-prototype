import { useMemo } from 'react';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
} from '../constants/mapConfig';
import { MapCanvas } from '../../../lib/map/MapCanvas';
import { buildMapPopupNode } from '../utils/mapboxPopup';

const markerStyles = {
  event: {
    className: 'map-marker map-marker-event',
    label: 'E',
  },
  place: {
    className: 'map-marker map-marker-place',
    label: 'P',
  },
  preview: {
    className: 'map-marker map-marker-preview',
    label: '+',
  },
};

export function CityMap({
  pins,
  selectedPinId,
  focusedPinId,
  previewCoordinates,
  animatePreviewPin = true,
  mapStyle,
  onMapClick,
  onPinSelect,
  onMapReady,
}) {
  const focusedPin = useMemo(
    () => pins.find((pin) => pin.id === focusedPinId) || null,
    [focusedPinId, pins]
  );

  const markers = useMemo(
    () => pins.map((pin) => {
      const markerConfig = markerStyles[pin.type] ?? markerStyles.place;
      const [lat, lng] = pin.coordinates;

      return {
        id: pin.id,
        lat,
        lng,
        className: markerConfig.className,
        label: markerConfig.label,
        isSelected: pin.id === selectedPinId,
        popupNode: buildMapPopupNode(pin),
        onSelect: () => onPinSelect?.(pin),
      };
    }),
    [onPinSelect, pins, selectedPinId]
  );

  const previewMarker = previewCoordinates
    ? {
        lat: previewCoordinates.lat,
        lng: previewCoordinates.lng,
        className: `${markerStyles.preview.className}${animatePreviewPin ? ' is-animated' : ''}`.trim(),
        label: markerStyles.preview.label,
      }
    : null;

  const focusTarget = focusedPin
    ? {
        id: focusedPin.id,
        lat: focusedPin.coordinates[0],
        lng: focusedPin.coordinates[1],
      }
    : null;

  return (
    <div className="map-canvas">
      <MapCanvas
        className="mapbox-map"
        initialCenter={MAP_CENTER_BAKU_LNGLAT}
        initialZoom={DEFAULT_MAP_ZOOM}
        maxBounds={AZERBAIJAN_MAX_BOUNDS}
        mapStyle={mapStyle}
        onMapClick={onMapClick}
        onMapReady={onMapReady}
        markers={markers}
        previewMarker={previewMarker}
        focusTarget={focusTarget}
      />
    </div>
  );
}
