import { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { subscribeToPins } from '../../../lib/backend/pinsClient';
import { useAddPinForm } from '../../pins/hooks/useAddPinForm';
import { Header } from '../components/overlay/Header';
import { MapControls } from '../components/overlay/MapControls';
import { Sidebar } from '../components/overlay/Sidebar';
import { MAPLIBRE_DARK_STYLE } from '../constants/mapConfig';
import { useMapCreateFlow } from '../hooks/useMapCreateFlow';
import { useMapOverlayState } from '../hooks/useMapOverlayState';
import { useMapPinDiscovery } from '../hooks/useMapPinDiscovery';
import { useMapPreferences } from '../hooks/useMapPreferences';
import { useSavedPins } from '../hooks/useSavedPins';
import { loadCityMapModule } from '../utils/cityMapLoader';
import {
  loadAddPinPanelModule,
  loadPinCardModule,
  loadSettingsPanelModule,
} from '../utils/mapOverlayLoaders';

const CityMap = lazy(() =>
  loadCityMapModule().then((module) => ({ default: module.CityMap }))
);
const AddPinPanel = lazy(() =>
  loadAddPinPanelModule().then((module) => ({ default: module.AddPinPanel }))
);
const SettingsPanel = lazy(() =>
  loadSettingsPanelModule().then((module) => ({ default: module.SettingsPanel }))
);
const PinCard = lazy(() =>
  loadPinCardModule().then((module) => ({ default: module.PinCard }))
);

function MapCanvasFallback() {
  return (
    <div className="map-canvas">
      <div className="mapbox-map flex items-center justify-center bg-[#09111b] text-slate-400">
        Loading map...
      </div>
    </div>
  );
}

function DeferredPanelFallback() {
  return null;
}

function isPinsFetchNetworkError(error) {
  const message = String(error?.message || '').toLowerCase();
  const details = String(error?.details || '').toLowerCase();

  return (
    message.includes('failed to fetch')
    || message.includes('networkerror')
    || message.includes('load failed')
    || details.includes('failed to fetch')
  );
}

function getPinsErrorMessage(error) {
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('supabase client is not configured')) {
    return 'Pins are not configured yet. Add your Supabase keys to load the live map.';
  }

  if (
    message.includes('row-level security')
    || message.includes('permission')
    || message.includes('not allowed')
    || message.includes('violates row-level security')
  ) {
    return 'Pins are not available right now. Check your Supabase permissions.';
  }

  if (isPinsFetchNetworkError(error)) {
    return 'Pins are temporarily unavailable. Check your connection and try again.';
  }

  return 'Could not load pins right now. Check your database setup and try again.';
}

export function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [pins, setPins] = useState([]);
  const [isPinsReady, setIsPinsReady] = useState(false);
  const [pinsError, setPinsError] = useState('');
  const [mapActions, setMapActions] = useState(null);

  const {
    mapSettings,
    toggleMapSetting,
  } = useMapPreferences();

  const {
    savedPinIds,
    isSavedPinsLoading,
    savedPinsError,
    toggleSavedPin,
  } = useSavedPins({
    user,
    isAuthenticated,
    isAuthLoading,
    pins,
    isPinsReady,
    navigate,
    returnToPath: `${location.pathname}${location.search}`,
  });

  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isPinCardExpanded,
    setIsPinCardExpanded,
    locateMessage,
    setLocateMessage,
    closePanels,
  } = useMapOverlayState();

  const {
    selectedCoordinates,
    setSelectedCoordinates,
    focusedPinId,
    setFocusedPinId,
    createdPinId,
    isAddPinPanelOpen,
    routeCreatedPinId,
    openAddPinPanel,
    closeAddPinPanel,
    handleMapLocationSelect,
    handleCreateSuccess,
    clearCreatedPinState,
  } = useMapCreateFlow({
    navigate,
    searchParams,
    isAuthenticated,
    isAuthLoading,
    openCreateOnMapClick: mapSettings.openCreateOnMapClick,
    closeOverlayPanels: closePanels,
  });

  const {
    activeSection,
    searchQuery,
    setSearchQuery,
    setSelectedPinId,
    visiblePins,
    createdPin,
    effectiveSelectedPinId,
    selectedPin,
    shouldShowNoResults,
    sectionMeta,
    handleSectionChange,
  } = useMapPinDiscovery({
    pins,
    savedPinIds,
    isSavedPinsLoading,
    createdPinId,
    routeCreatedPinId,
    isAddPinPanelOpen,
  });

  useEffect(() => {
    const unsubscribe = subscribeToPins(
      (nextPins) => {
        setPins(nextPins);
        setIsPinsReady(true);
        setPinsError('');
      },
      (error) => {
        if (isPinsFetchNetworkError(error)) {
          console.warn('Pins feed is temporarily unreachable:', error);
        } else {
          console.error('Failed to load pins:', error);
        }

        setPins([]);
        setIsPinsReady(true);
        setPinsError(getPinsErrorMessage(error));
      }
    );

    return () => unsubscribe();
  }, []);

  const {
    values: addPinValues,
    errors: addPinErrors,
    isSubmitting: isAddPinSubmitting,
    submitError: addPinSubmitError,
    handleFieldChange: handleAddPinFieldChange,
    handleTypeChange: handleAddPinTypeChange,
    handleSubmit: handleAddPinSubmit,
    resetForm: resetAddPinForm,
  } = useAddPinForm({
    initialCoordinates: selectedCoordinates,
    user,
    onSuccess: async (nextCreatedPinId) => {
      setSelectedPinId(nextCreatedPinId);
      handleCreateSuccess(nextCreatedPinId);
    },
  });

  useEffect(() => {
    if (!isAddPinPanelOpen) {
      resetAddPinForm(selectedCoordinates);
    }
  }, [isAddPinPanelOpen, resetAddPinForm, selectedCoordinates]);

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
    loadPinCardModule();
    setSelectedPinId(pin.id);
    setFocusedPinId(pin.id);
    setSelectedCoordinates(null);
    closeAddPinPanel();
    setIsPinCardExpanded(true);
  }

  function handleMapSectionChange(section) {
    const nextParams = new URLSearchParams(searchParams);
    let shouldReplaceSearch = false;

    ['createdPinId', 'lat', 'lng', 'openCreate'].forEach((key) => {
      if (nextParams.has(key)) {
        nextParams.delete(key);
        shouldReplaceSearch = true;
      }
    });

    if (shouldReplaceSearch) {
      navigate(
        {
          pathname: location.pathname,
          search: nextParams.toString() ? `?${nextParams.toString()}` : '',
        },
        { replace: true }
      );
    }

    handleSectionChange(section);
    setSelectedPinId(null);
    setFocusedPinId(null);
    clearCreatedPinState();
    setIsPinCardExpanded(false);
  }

  function handleMapCanvasClick(coordinates) {
    if (selectedPin || effectiveSelectedPinId || isPinCardExpanded) {
      setSelectedPinId(null);
      setFocusedPinId(null);
      clearCreatedPinState();
      setIsPinCardExpanded(false);
      return;
    }

    handleMapLocationSelect(coordinates);
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

  async function handleLocateUser() {
    try {
      setLocateMessage('');
      await mapActions?.locateUser?.();
    } catch (error) {
      setLocateMessage(error?.message || 'We could not determine your location right now. Please try again.');
    }
  }

  return (
    <section className="map-screen map-theme-night">
      <Suspense fallback={<MapCanvasFallback />}>
        <CityMap
          pins={visiblePins}
          selectedPinId={effectiveSelectedPinId}
          focusedPinId={focusedPinId || createdPin?.id || null}
          previewCoordinates={selectedCoordinates}
          animatePreviewPin={mapSettings.animatePreviewPin}
          mapStyle={MAPLIBRE_DARK_STYLE}
          onMapClick={handleMapCanvasClick}
          onPinSelect={handlePinSelect}
          onMapReady={setMapActions}
        />
      </Suspense>

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
            <div className="map-feedback-stack">
              {locateMessage ? (
                <div className="map-alert map-alert-notice" role="status" aria-live="polite">
                  {locateMessage}
                </div>
              ) : null}
            </div>

            {!isAddPinPanelOpen ? (
              <div className="map-feedback-stack">
                {pinsError ? <div className="map-alert map-alert-error">{pinsError}</div> : null}
                {!pinsError && savedPinsError ? <div className="map-alert map-alert-error">{savedPinsError}</div> : null}
                {!pinsError && shouldShowNoResults ? (
                  <div className="map-alert map-alert-empty" role="status" aria-live="polite">
                    No pins match this view. Try clearing search or switching filters.
                  </div>
                ) : null}
                {createdPin ? (
                  <div className="map-alert map-alert-success">
                    New pin added: <strong>{createdPin.title}</strong> is now live on the map.
                  </div>
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
            if (isDesktopViewport() && mapSettings.sidebarExpandOnHover) {
              setIsSidebarOpen(true);
            }
          }}
          onHoverClose={() => {
            if (isDesktopViewport() && mapSettings.sidebarExpandOnHover) {
              setIsSidebarOpen(false);
            }
          }}
          activeSection={activeSection}
          onSectionChange={handleMapSectionChange}
          sectionMeta={sectionMeta}
          onSettingsClick={() => {
            loadSettingsPanelModule();
            setIsSettingsOpen(true);
            if (!isDesktopViewport()) {
              setIsSidebarOpen(false);
            }
          }}
          onCreatePinClick={() => {
            loadAddPinPanelModule();
            openAddPinPanel();
          }}
        />

        <Suspense fallback={<DeferredPanelFallback />}>
          <SettingsPanel
            isOpen={isSettingsOpen}
            settings={mapSettings}
            onToggle={toggleMapSetting}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>

        <Suspense fallback={<DeferredPanelFallback />}>
          <AddPinPanel
            user={user}
            values={addPinValues}
            errors={addPinErrors}
            isSubmitting={isAddPinSubmitting}
            submitError={addPinSubmitError}
            selectedCoordinates={selectedCoordinates}
            onFieldChange={handleAddPinFieldChange}
            onTypeChange={handleAddPinTypeChange}
            onSubmit={handleAddPinSubmit}
            onCancel={closeAddPinPanel}
            variant="drawer"
            isOpen={isAddPinPanelOpen}
            locationPrompt="Click anywhere on the map to choose where this new pin should live. The form will keep listening while you pick the location."
            submitDisabled={!selectedCoordinates}
            cancelLabel="Close Panel"
          />
        </Suspense>

        <MapControls
          onLocate={handleLocateUser}
          onZoomIn={() => mapActions?.zoomIn()}
          onZoomOut={() => mapActions?.zoomOut()}
        />

        {!isAddPinPanelOpen ? (
          <Suspense fallback={<DeferredPanelFallback />}>
            <PinCard
              pin={selectedPin}
              isSaved={selectedPin ? savedPinIds.includes(selectedPin.id) : false}
              isExpanded={isPinCardExpanded}
              onToggleExpanded={() => setIsPinCardExpanded((current) => !current)}
              onDirectionsClick={handleDirectionsClick}
              onShareClick={handleShareClick}
              onToggleSaved={() => void (selectedPin && toggleSavedPin(selectedPin.id))}
            />
          </Suspense>
        ) : null}
      </div>
    </section>
  );
}
