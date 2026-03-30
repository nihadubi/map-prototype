import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { CityMap } from '../components/CityMap';
import { FilterBar } from '../components/overlay/FilterBar';
import { Header } from '../components/overlay/Header';
import { MapControls } from '../components/overlay/MapControls';
import { PinCard } from '../components/overlay/PinCard';
import { Sidebar } from '../components/overlay/Sidebar';
import { subscribeToPins } from '../../pins/services/pins.service';

function buildFilterOptions(pins) {
  const categoryFilters = Array.from(
    new Set(pins.map((pin) => pin.category).filter(Boolean))
  )
    .slice(0, 6)
    .map((category) => ({
      value: category,
      label: category.toUpperCase(),
    }));

  return [
    { value: 'all', label: 'ALL' },
    { value: 'event', label: 'EVENTS' },
    { value: 'place', label: 'PLACES' },
    ...categoryFilters,
  ];
}

function matchesSearch(pin, query) {
  if (!query) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return [pin.title, pin.description, pin.category, pin.placeType, pin.eventDate]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

export function MapPage() {
  const navigate = useNavigate();
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [isPinsLoading, setIsPinsLoading] = useState(true);
  const [pinsError, setPinsError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const [mapActions, setMapActions] = useState(null);

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

  const filterOptions = useMemo(() => buildFilterOptions(pins), [pins]);

  const visiblePins = useMemo(() => {
    return pins.filter((pin) => {
      const matchesFilter =
        activeFilter === 'all' || pin.type === activeFilter || pin.category === activeFilter;

      return matchesFilter && matchesSearch(pin, searchQuery);
    });
  }, [activeFilter, pins, searchQuery]);

  const createdPin = useMemo(
    () => pins.find((pin) => pin.id === createdPinId) || null,
    [createdPinId, pins]
  );

  const effectiveSelectedPinId = useMemo(() => {
    if (selectedPinId && visiblePins.some((pin) => pin.id === selectedPinId)) {
      return selectedPinId;
    }

    if (createdPin && visiblePins.some((pin) => pin.id === createdPin.id)) {
      return createdPin.id;
    }

    return visiblePins[0]?.id || null;
  }, [createdPin, selectedPinId, visiblePins]);

  const selectedPin = useMemo(() => {
    return visiblePins.find((pin) => pin.id === effectiveSelectedPinId)
      || pins.find((pin) => pin.id === effectiveSelectedPinId)
      || null;
  }, [effectiveSelectedPinId, pins, visiblePins]);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  function handlePinSelect(pin) {
    setSelectedPinId(pin.id);
  }

  function handleDirectionsClick() {
    if (!selectedPin) {
      return;
    }

    const [lat, lng] = selectedPin.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  }

  async function handleShareClick() {
    if (!selectedPin) {
      return;
    }

    const shareText = `${selectedPin.title} in Baku`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedPin.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  return (
    <section className="map-screen">
      <CityMap
        pins={visiblePins}
        selectedPinId={effectiveSelectedPinId}
        onMapClick={setSelectedCoordinates}
        onPinSelect={handlePinSelect}
        onMapReady={setMapActions}
      />

      <div className="map-overlay-shell">
        <Header
          query={searchQuery}
          onQueryChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
          onFilterClick={() => setIsFilterBarVisible((current) => !current)}
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginClick={() => navigate('/auth')}
          onLogoutClick={handleLogout}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isAuthenticated={isAuthenticated}
        />

        <FilterBar
          filters={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          isVisible={isFilterBarVisible}
        />

        {pinsError ? <div className="map-alert map-alert-error">{pinsError}</div> : null}
        {createdPin ? (
          <div className="map-alert map-alert-success">
            New pin added: <strong>{createdPin.title}</strong> is now live on the map.
          </div>
        ) : null}
        {selectedCoordinates ? (
          <div className="map-alert map-alert-info">
            Last map click: {selectedCoordinates.lat}, {selectedCoordinates.lng}
          </div>
        ) : null}
        {isPinsLoading ? <div className="map-loading-panel">Loading live pins from Firestore...</div> : null}
        {!isPinsLoading && !visiblePins.length ? (
          <div className="map-loading-panel">No pins match the current search and filters yet.</div>
        ) : null}

        <MapControls
          onLocate={() => mapActions?.centerOnBaku()}
          onZoomIn={() => mapActions?.zoomIn()}
          onZoomOut={() => mapActions?.zoomOut()}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        />

        <PinCard
          pin={selectedPin}
          onDirectionsClick={handleDirectionsClick}
          onShareClick={handleShareClick}
        />
      </div>
    </section>
  );
}
