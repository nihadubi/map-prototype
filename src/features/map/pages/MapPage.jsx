import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { CityMap } from '../components/CityMap';
import { Header } from '../components/overlay/Header';
import { MapControls } from '../components/overlay/MapControls';
import { PinCard } from '../components/overlay/PinCard';
import { Sidebar } from '../components/overlay/Sidebar';
import { AddPinPanel } from '../../pins/components/add-pin/AddPinPanel';
import { categoryOptions } from '../../pins/constants/pinSchema';
import { useAddPinForm } from '../../pins/hooks/useAddPinForm';
import { subscribeToPins } from '../../pins/services/pins.service';

const SAVED_PINS_STORAGE_KEY = 'citylayer.savedPins';

function matchesSearch(pin, query) {
  if (!query) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return [pin.title, pin.description, pin.category, pin.placeType, pin.eventDate]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

function readSavedPinIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_PINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to read saved pins:', error);
    return [];
  }
}

export function MapPage() {
  const navigate = useNavigate();
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [pinsError, setPinsError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapActions, setMapActions] = useState(null);
  const [savedPinIds, setSavedPinIds] = useState(readSavedPinIds);
  const [isPinCardExpanded, setIsPinCardExpanded] = useState(false);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [isAddPinPanelOpen, setIsAddPinPanelOpen] = useState(false);
  const [createdPinId, setCreatedPinId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToPins(
      (nextPins) => {
        setPins(nextPins);
      },
      (error) => {
        console.error('Failed to load pins:', error);
        setPinsError('Could not load pins from Firestore.');
      }
    );

    return () => unsubscribe();
  }, []);

  const routeCreatedPinId = searchParams.get('createdPinId');

  useEffect(() => {
    window.localStorage.setItem(SAVED_PINS_STORAGE_KEY, JSON.stringify(savedPinIds));
  }, [savedPinIds]);

  const basePins = useMemo(() => {
    switch (activeSection) {
      case 'events':
        return pins.filter((pin) => pin.type === 'event');
      case 'saved':
        return pins.filter((pin) => savedPinIds.includes(pin.id));
      case 'collections':
        return pins.filter((pin) => pin.type === 'place');
      case 'discover':
      default:
        return pins;
    }
  }, [activeSection, pins, savedPinIds]);

  const visiblePins = useMemo(() => {
    return basePins.filter((pin) => matchesSearch(pin, searchQuery));
  }, [basePins, searchQuery]);

  const effectiveCreatedPinId = createdPinId || routeCreatedPinId || null;

  const createdPin = useMemo(
    () => pins.find((pin) => pin.id === effectiveCreatedPinId) || null,
    [effectiveCreatedPinId, pins]
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

  function isDesktopViewport() {
    return typeof window !== 'undefined' && window.matchMedia('(min-width: 1025px)').matches;
  }

  function handlePinSelect(pin) {
    setSelectedPinId(pin.id);
    setFocusedPinId(pin.id);
    setIsPinCardExpanded(true);
    setSelectedCoordinates(null);
    setIsAddPinPanelOpen(false);
  }

  function handleSectionChange(section) {
    setActiveSection(section);
    setSearchQuery('');
    setIsPinCardExpanded(false);
  }

  function handleToggleSaved(pinId) {
    setSavedPinIds((current) => (
      current.includes(pinId)
        ? current.filter((id) => id !== pinId)
        : [...current, pinId]
    ));
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

  function handleOpenAddPin() {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/' } });
      return;
    }

    setIsSidebarOpen(false);
    setIsPinCardExpanded(false);
    setIsAddPinPanelOpen(true);
  }

  function handleCloseAddPinPanel() {
    setIsAddPinPanelOpen(false);
  }

  const {
    values: addPinValues,
    errors: addPinErrors,
    isSubmitting: isAddPinSubmitting,
    submitError: addPinSubmitError,
    handleFieldChange: handleAddPinFieldChange,
    handleTypeChange: handleAddPinTypeChange,
    handleCategoryChange: handleAddPinCategoryChange,
    handleSubmit: handleAddPinSubmit,
    resetForm: resetAddPinForm,
  } = useAddPinForm({
    initialCoordinates: selectedCoordinates,
    user,
    onSuccess: async (nextCreatedPinId) => {
      setCreatedPinId(nextCreatedPinId);
      setFocusedPinId(nextCreatedPinId);
      setSelectedPinId(nextCreatedPinId);
      setIsAddPinPanelOpen(false);
      setSelectedCoordinates(null);
    },
  });

  useEffect(() => {
    if (!isAddPinPanelOpen) {
      resetAddPinForm(selectedCoordinates);
    }
  }, [isAddPinPanelOpen, resetAddPinForm, selectedCoordinates]);

  const sectionMeta = useMemo(() => ({
    discover: `${pins.length}`,
    events: `${pins.filter((pin) => pin.type === 'event').length}`,
    saved: `${savedPinIds.filter((id) => pins.some((pin) => pin.id === id)).length}`,
    collections: `${new Set(pins.filter((pin) => pin.type === 'place').map((pin) => pin.category)).size}`,
  }), [pins, savedPinIds]);

  return (
    <section className="map-screen">
      <CityMap
        pins={visiblePins}
        selectedPinId={effectiveSelectedPinId}
        focusedPinId={focusedPinId || createdPin?.id || null}
        previewCoordinates={selectedCoordinates}
        onMapClick={setSelectedCoordinates}
        onPinSelect={handlePinSelect}
        onMapReady={setMapActions}
      />

      <div className="map-overlay-shell">
        <div className="map-top-stack">
          <Header
            query={searchQuery}
            onQueryChange={setSearchQuery}
            isSidebarOpen={isSidebarOpen}
            onMenuClick={() => setIsSidebarOpen((current) => !current)}
            isAuthLoading={isAuthLoading}
            isAuthenticated={isAuthenticated}
            user={user}
            onLoginClick={() => navigate('/auth')}
            onLogoutClick={handleLogout}
          />

          <div className="map-top-content">
            {!isAddPinPanelOpen ? (
              <div className="map-feedback-stack">
                {pinsError ? <div className="map-alert map-alert-error">{pinsError}</div> : null}
                {createdPin ? (
                  <div className="map-alert map-alert-success">
                    New pin added: <strong>{createdPin.title}</strong> is now live on the map.
                  </div>
                ) : null}
                {selectedCoordinates ? (
                  <section className="map-selection-panel">
                    <div className="map-selection-copy">
                      <span className="map-selection-kicker">CityLayer Pin Drop</span>
                      <h2>Selected map location</h2>
                      <p>
                        {selectedCoordinates.lat}, {selectedCoordinates.lng}
                      </p>
                    </div>
                    <div className="map-selection-actions">
                      <button type="button" className="map-primary-button" onClick={handleOpenAddPin}>
                        Create Pin
                      </button>
                      <button
                        type="button"
                        className="map-card-icon-button"
                        aria-label="Clear selected location"
                        onClick={() => setSelectedCoordinates(null)}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">close</span>
                      </button>
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCloseAfterSelect={() => {
            if (!isDesktopViewport()) {
              setIsSidebarOpen(false);
            }
          }}
          onHoverOpen={() => {
            if (isDesktopViewport()) {
              setIsSidebarOpen(true);
            }
          }}
          onHoverClose={() => {
            if (isDesktopViewport()) {
              setIsSidebarOpen(false);
            }
          }}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sectionMeta={sectionMeta}
          onCreatePinClick={handleOpenAddPin}
        />

        <AddPinPanel
          user={user}
          values={addPinValues}
          errors={addPinErrors}
          categories={categoryOptions}
          isSubmitting={isAddPinSubmitting}
          submitError={addPinSubmitError}
          selectedCoordinates={selectedCoordinates}
          onFieldChange={handleAddPinFieldChange}
          onTypeChange={handleAddPinTypeChange}
          onCategoryChange={handleAddPinCategoryChange}
          onSubmit={handleAddPinSubmit}
          onCancel={handleCloseAddPinPanel}
          variant="drawer"
          isOpen={isAddPinPanelOpen}
          locationPrompt="Click anywhere on the map to choose where this new pin should live. The form will keep listening while you pick the location."
          submitDisabled={!selectedCoordinates}
          cancelLabel="Close Panel"
        />

        <MapControls
          onLocate={() => mapActions?.locateUser?.()}
          onZoomIn={() => mapActions?.zoomIn()}
          onZoomOut={() => mapActions?.zoomOut()}
        />

        {!isAddPinPanelOpen ? (
          <PinCard
            pin={selectedPin}
            isSaved={selectedPin ? savedPinIds.includes(selectedPin.id) : false}
            isExpanded={isPinCardExpanded}
            onToggleExpanded={() => setIsPinCardExpanded((current) => !current)}
            onDirectionsClick={handleDirectionsClick}
            onShareClick={handleShareClick}
            onToggleSaved={() => selectedPin && handleToggleSaved(selectedPin.id)}
          />
        ) : null}
      </div>
    </section>
  );
}
