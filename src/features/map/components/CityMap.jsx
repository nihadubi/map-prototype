import { useMemo } from 'react';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
} from '../constants/mapConfig';
import { MapCanvas } from '../../../lib/map/MapCanvas';

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

  const pinLookup = useMemo(
    () => new Map(pins.map((pin) => [pin.id, pin])),
    [pins]
  );

  const pinFeatures = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: pins.map((pin) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pin.coordinates[1], pin.coordinates[0]],
        },
        properties: {
          id: pin.id,
          pinType: pin.type,
          label: pin.type === 'event' ? 'E' : 'P',
          isSelected: pin.id === selectedPinId,
        },
      })),
    }),
    [pins, selectedPinId]
  );

  const previewFeatures = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: previewCoordinates
        ? [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [previewCoordinates.lng, previewCoordinates.lat],
              },
              properties: {
                id: 'preview-pin',
                label: '+',
                radius: animatePreviewPin ? 16 : 14,
              },
            },
          ]
        : [],
    }),
    [animatePreviewPin, previewCoordinates]
  );

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
        onPinSelect={onPinSelect}
        onMapReady={onMapReady}
        pinFeatures={pinFeatures}
        previewFeatures={previewFeatures}
        pinLookup={pinLookup}
        focusTarget={focusTarget}
      />
    </div>
  );
}
