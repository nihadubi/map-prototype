import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AZERBAIJAN_BOUNDS, DEFAULT_MAP_ZOOM, MAP_CENTER_BAKU } from '../constants/mapConfig';

const markerStyles = {
  event: {
    className: 'map-marker map-marker-event',
    label: 'E',
  },
  place: {
    className: 'map-marker map-marker-place',
    label: 'P',
  },
};

function createMarkerIcon(type, isSelected = false) {
  const marker = markerStyles[type] ?? markerStyles.place;

  return L.divIcon({
    className: 'map-marker-wrapper',
    html: `<span class="${marker.className}${isSelected ? ' is-selected' : ''}">${marker.label}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -10],
  });
}

function MapBridge({ onMapClick, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapReady) {
      return undefined;
    }

    onMapReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      centerOnBaku: () => map.flyTo(MAP_CENTER_BAKU, DEFAULT_MAP_ZOOM, { duration: 0.8 }),
      focusPin: (coordinates) => map.flyTo(coordinates, Math.max(map.getZoom(), 15), { duration: 0.8 }),
    });

    return () => onMapReady(null);
  }, [map, onMapReady]);

  useMapEvents({
    click(event) {
      const nextCoordinates = {
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6)),
      };

      onMapClick(nextCoordinates);
      console.info('CityLayer map click coordinates:', nextCoordinates);
    },
  });

  return null;
}

function MapFocus({ selectedPin }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedPin?.coordinates) {
      return;
    }

    map.flyTo(selectedPin.coordinates, Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, selectedPin]);

  return null;
}

function formatCreatedBy(pin) {
  return pin.createdBy || 'Community member';
}

export function CityMap({ pins, selectedPinId, onMapClick, onPinSelect, onMapReady }) {
  const icons = useMemo(
    () => ({
      event: {
        default: createMarkerIcon('event', false),
        selected: createMarkerIcon('event', true),
      },
      place: {
        default: createMarkerIcon('place', false),
        selected: createMarkerIcon('place', true),
      },
    }),
    []
  );

  const selectedPin = useMemo(
    () => pins.find((pin) => pin.id === selectedPinId) || null,
    [pins, selectedPinId]
  );

  return (
    <div className="map-canvas">
      <MapContainer
        center={MAP_CENTER_BAKU}
        zoom={DEFAULT_MAP_ZOOM}
        minZoom={7}
        maxZoom={16}
        maxBounds={AZERBAIJAN_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom
        zoomControl={false}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
        />

        <MapBridge onMapClick={onMapClick} onMapReady={onMapReady} />
        <MapFocus selectedPin={selectedPin} />

        {pins.map((pin) => {
          const isSelected = pin.id === selectedPinId;
          const pinIcons = pin.type === 'event' ? icons.event : icons.place;

          return (
            <Marker
              key={pin.id}
              position={pin.coordinates}
              icon={isSelected ? pinIcons.selected : pinIcons.default}
              eventHandlers={{
                click: () => onPinSelect?.(pin),
              }}
            >
              <Popup minWidth={240}>
                <div className="popup-card stack-sm">
                  <span className={`pin-badge pin-badge-${pin.type}`}>{pin.type}</span>
                  <div>
                    <h3 className="popup-title">{pin.title}</h3>
                    <p className="muted popup-description">{pin.description}</p>
                  </div>
                  <dl className="popup-meta">
                    <div>
                      <dt>Category</dt>
                      <dd>{pin.category}</dd>
                    </div>
                    <div>
                      <dt>Added by</dt>
                      <dd>{formatCreatedBy(pin)}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{pin.createdAtLabel}</dd>
                    </div>
                    {pin.type === 'event' ? (
                      <>
                        <div>
                          <dt>Date</dt>
                          <dd>{pin.eventDate || 'TBD'}</dd>
                        </div>
                        <div>
                          <dt>Starts</dt>
                          <dd>{pin.startTime || 'Not set'}</dd>
                        </div>
                      </>
                    ) : (
                      <div>
                        <dt>Place type</dt>
                        <dd>{pin.placeType || 'General'}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
