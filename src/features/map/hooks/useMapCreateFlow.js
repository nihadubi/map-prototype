import { useEffect, useState } from 'react';
import { isWithinAzerbaijan } from '../utils/azerbaijanBounds';

export function useMapCreateFlow({
  navigate,
  searchParams,
  isAuthenticated,
  isAuthLoading,
  openCreateOnMapClick,
  closeOverlayPanels,
}) {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [createdPinId, setCreatedPinId] = useState(null);
  const [isAddPinPanelOpen, setIsAddPinPanelOpen] = useState(false);

  const routeOpenCreate = searchParams.get('openCreate') === '1';
  const routeLat = searchParams.get('lat');
  const routeLng = searchParams.get('lng');
  const routeCreatedPinId = searchParams.get('createdPinId');

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

    if (routeLat && routeLng) {
      const nextCoordinates = {
        lat: Number(routeLat),
        lng: Number(routeLng),
      };

      if (
        Number.isFinite(nextCoordinates.lat)
        && Number.isFinite(nextCoordinates.lng)
        && isWithinAzerbaijan(nextCoordinates.lat, nextCoordinates.lng)
      ) {
        setSelectedCoordinates(nextCoordinates);
      }
    }

    setIsAddPinPanelOpen(true);
  }, [
    closeOverlayPanels,
    isAuthenticated,
    isAuthLoading,
    navigate,
    routeLat,
    routeLng,
    routeOpenCreate,
    searchParams,
  ]);

  function openAddPinPanel() {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/app' } });
      return;
    }

    closeOverlayPanels();
    setIsAddPinPanelOpen(true);
  }

  function closeAddPinPanel() {
    setIsAddPinPanelOpen(false);
  }

  function handleMapLocationSelect(coordinates) {
    if (!isWithinAzerbaijan(coordinates.lat, coordinates.lng)) {
      setSelectedCoordinates(null);
      setIsAddPinPanelOpen(false);
      return;
    }

    setSelectedCoordinates(coordinates);
    setFocusedPinId(null);
    closeOverlayPanels();

    if (isAuthenticated) {
      if (openCreateOnMapClick) {
        setIsAddPinPanelOpen(true);
      }
      return;
    }

    navigate('/auth', { state: { from: '/app' } });
  }

  function handleCreateSuccess(nextCreatedPinId) {
    setCreatedPinId(nextCreatedPinId);
    setFocusedPinId(nextCreatedPinId);
    setIsAddPinPanelOpen(false);
    setSelectedCoordinates(null);
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
  };
}
