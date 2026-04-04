import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { subscribeToPins } from '../../../lib/backend/pinsClient';
import { AddPinPanel } from '../../pins/components/add-pin/AddPinPanel';
import { useAddPinForm } from '../../pins/hooks/useAddPinForm';
import { categoryOptions } from '../../pins/constants/pinSchema';
import { CityMap } from '../components/CityMap';
import { Header } from '../components/overlay/Header';
import { MapControls } from '../components/overlay/MapControls';
import { PinCard } from '../components/overlay/PinCard';
import { SettingsPanel } from '../components/overlay/SettingsPanel';
import { Sidebar } from '../components/overlay/Sidebar';
import { MAPLIBRE_DARK_STYLE } from '../constants/mapConfig';
import { useMapCreateFlow } from '../hooks/useMapCreateFlow';
import { useMapOverlayState } from '../hooks/useMapOverlayState';
import { useMapPinDiscovery } from '../hooks/useMapPinDiscovery';
import { useMapPreferences } from '../hooks/useMapPreferences';

export function MapPage() {
  const navigate = useNavigate();
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [pins, setPins] = useState([]);
  const [pinsError, setPinsError] = useState('');
  const [mapActions, setMapActions] = useState(null);

  const {
    savedPinIds,
    mapSettings,
    toggleSavedPin,
    toggleMapSetting,
  } = useMapPreferences();

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
    selectedPinId,
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
    createdPinId,
    routeCreatedPinId,
    isAddPinPanelOpen,
  });

  useEffect(() => {
    const unsubscribe = subscribeToPins(
      (nextPins) => {
        setPins(nextPins);
      },
      (error) => {
        console.error('Failed to load pins:', error);
        setPinsError('Could not load pins right now. Check your database setup and try again.');
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
    handleCategoryChange: handleAddPinCategoryChange,
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
    setSelectedPinId(pin.id);
    setFocusedPinId(pin.id);
    setSelectedCoordinates(null);
    closeAddPinPanel();
    setIsPinCardExpanded(true);
  }

  function handleMapSectionChange(section) {
    handleSectionChange(section);
    setIsPinCardExpanded(false);
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
      <CityMap
        pins={visiblePins}
        selectedPinId={effectiveSelectedPinId}
        focusedPinId={focusedPinId || createdPin?.id || null}
        previewCoordinates={selectedCoordinates}
        animatePreviewPin={mapSettings.animatePreviewPin}
        mapStyle={MAPLIBRE_DARK_STYLE}
        onMapClick={handleMapLocationSelect}
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
            setIsSettingsOpen(true);
            if (!isDesktopViewport()) {
              setIsSidebarOpen(false);
            }
          }}
          onCreatePinClick={openAddPinPanel}
        />

        <SettingsPanel
          isOpen={isSettingsOpen}
          settings={mapSettings}
          onToggle={toggleMapSetting}
          onClose={() => setIsSettingsOpen(false)}
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
          onCancel={closeAddPinPanel}
          variant="drawer"
          isOpen={isAddPinPanelOpen}
          locationPrompt="Click anywhere on the map to choose where this new pin should live. The form will keep listening while you pick the location."
          submitDisabled={!selectedCoordinates}
          cancelLabel="Close Panel"
        />

        <MapControls
          onLocate={handleLocateUser}
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
            onToggleSaved={() => selectedPin && toggleSavedPin(selectedPin.id)}
          />
        ) : null}
      </div>
    </section>
  );
}
