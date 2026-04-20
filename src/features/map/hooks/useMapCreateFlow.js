import { useEffect, useMemo, useState } from 'react';
import { isWithinAzerbaijan } from '../utils/azerbaijanBounds';

export function useMapCreateFlow({
  navigate,
  searchParams,
  isAuthenticated,
  isAuthLoading,
  openCreateOnMapClick,
  closeOverlayPanels,
}) {
  const [selectedCoordinatesState, setSelectedCoordinates] = useState(null);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [createdPinId, setCreatedPinId] = useState(null);
  const [isManualAddPinPanelOpen, setIsManualAddPinPanelOpen] = useState(false);

  const routeOpenCreate = searchParams.get('openCreate') === '1';
  const routeLat = searchParams.get('lat');
  const routeLng = searchParams.get('lng');
  const routeCreatedPinId = searchParams.get('createdPinId');

  const routeSelectedCoordinates = useMemo(() => {
    if (!routeLat || !routeLng) {
      return null;
    }

    const nextCoordinates = {
      lat: Number(routeLat),
      lng: Number(routeLng),
    };

    if (
      !Number.isFinite(nextCoordinates.lat)
      || !Number.isFinite(nextCoordinates.lng)
      || !isWithinAzerbaijan(nextCoordinates.lat, nextCoordinates.lng)
    ) {
      return null;
    }

    return nextCoordinates;
  }, [routeLat, routeLng]);

  const selectedCoordinates = selectedCoordinatesState ?? routeSelectedCoordinates;
  const isAddPinPanelOpen = isManualAddPinPanelOpen || (routeOpenCreate && isAuthenticated);

  useEffect(() => {
    if (!routeOpenCreate) {
      return;
    }

    if (!isAuthenticated) {
      if (!isAuthLoading) {
        navigate('/auth', { state: { from: `/app?${searchParams.toString()}` } });
      }
      return;
    }

    closeOverlayPanels();
  }, [
    closeOverlayPanels,
    isAuthenticated,
    isAuthLoading,
    navigate,
    routeOpenCreate,
    searchParams,
  ]);

  function openAddPinPanel() {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/app' } });
      return;
    }

    closeOverlayPanels();
    setIsManualAddPinPanelOpen(true);
  }

  function closeAddPinPanel() {
    setIsManualAddPinPanelOpen(false);
    setSelectedCoordinates(null);
  }

  function handleMapLocationSelect(coordinates) {
    if (!isWithinAzerbaijan(coordinates.lat, coordinates.lng)) {
      setSelectedCoordinates(null);
      setIsManualAddPinPanelOpen(false);
      return;
    }

    setSelectedCoordinates(coordinates);
    setFocusedPinId(null);
    closeOverlayPanels();

    if (isAuthenticated) {
      if (openCreateOnMapClick) {
        setIsManualAddPinPanelOpen(true);
      }
      return;
    }

    navigate('/auth', { state: { from: '/app' } });
  }

  function handleCreateSuccess(nextCreatedPinId) {
    setCreatedPinId(nextCreatedPinId);
    setFocusedPinId(nextCreatedPinId);
    setIsManualAddPinPanelOpen(false);
    setSelectedCoordinates(null);
  }

  function clearCreatedPinState() {
    setCreatedPinId(null);
    setFocusedPinId(null);
  }

  return {
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
  };
}
