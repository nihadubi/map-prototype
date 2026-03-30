import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CityMap } from '../components/CityMap';
import { MapFilterBar } from '../components/MapFilterBar';
import { subscribeToPins } from '../../pins/services/pins.service';

export function MapPage() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [pins, setPins] = useState([]);
  const [isPinsLoading, setIsPinsLoading] = useState(true);
  const [pinsError, setPinsError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPins(
      (nextPins) => {
        setPins(nextPins);
        setIsPinsLoading(false);
      },
      (error) => {
        console.error('Failed to load pins:', error);
        setPinsError('Could not load pins from Firestore.');
        setIsPinsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createdPinId = searchParams.get('createdPinId');

  const visiblePins = useMemo(() => {
    const basePins = activeFilter === 'all' ? pins : pins.filter((pin) => pin.type === activeFilter);
    return basePins;
  }, [activeFilter, pins]);

  const createdPin = useMemo(
    () => visiblePins.find((pin) => pin.id === createdPinId) || pins.find((pin) => pin.id === createdPinId) || null,
    [createdPinId, pins, visiblePins]
  );

  return (
    <section className="stack map-page">
      <div className="stack-sm">
        <h1>Discover Baku with CityLayer</h1>
        <p className="muted">
          Explore community-submitted events and underrated places around the city.
        </p>
      </div>

      <MapFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {pinsError ? <p className="form-error">{pinsError}</p> : null}

      {isPinsLoading ? (
        <section className="card stack-sm">
          <h2 className="section-title">Loading map pins...</h2>
          <p className="muted">Fetching live pins from Firestore.</p>
        </section>
      ) : (
        <>
          <CityMap pins={visiblePins} onMapClick={setSelectedCoordinates} />

          {visiblePins.length === 0 ? (
            <section className="card stack-sm">
              <h2 className="section-title">No pins yet</h2>
              <p className="muted">Be the first to add a place or event.</p>
            </section>
          ) : null}
        </>
      )}

      <section className="card map-feedback-panel">
        <div>
          <h2 className="section-title">Map interaction state</h2>
          <p className="muted">
            Clicking the map captures coordinates now so we can feed them into the add-pin flow next.
          </p>
        </div>

        {createdPin ? (
          <p className="success-banner">
            New pin added: <strong>{createdPin.title}</strong> is now live on the map.
          </p>
        ) : null}

        {selectedCoordinates ? (
          <div className="coordinates-readout">
            <span>Latitude: {selectedCoordinates.lat}</span>
            <span>Longitude: {selectedCoordinates.lng}</span>
          </div>
        ) : (
          <p className="muted">Click anywhere on the map to capture coordinates.</p>
        )}
      </section>
    </section>
  );
}
