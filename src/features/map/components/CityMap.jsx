import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_ZOOM, MAP_CENTER_BAKU } from '../constants/mapConfig';

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

function createMarkerIcon(type) {
  const marker = markerStyles[type] ?? markerStyles.place;

  return L.divIcon({
    className: 'map-marker-wrapper',
    html: `<span class="${marker.className}">${marker.label}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -10],
  });
}

function MapClickCapture({ onMapClick }) {
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

function formatCreatedBy(pin) {
  return pin.createdBy || 'Community member';
}

export function CityMap({ pins, onMapClick }) {
  const icons = useMemo(
    () => ({
      event: createMarkerIcon('event'),
      place: createMarkerIcon('place'),
    }),
    []
  );

  return (
    <div className="map-card card">
      <MapContainer center={MAP_CENTER_BAKU} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickCapture onMapClick={onMapClick} />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={pin.coordinates}
            icon={pin.type === 'event' ? icons.event : icons.place}
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
        ))}
      </MapContainer>
    </div>
  );
}
