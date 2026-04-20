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
  const [editingPin, setEditingPin] = useState(null);

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

  const editingPinCoordinates = useMemo(() => {
    if (!editingPin) {
      return null;
    }

    const nextCoordinates = {
      lat: Number(editingPin.lat ?? editingPin.coordinates?.[0]),
      lng: Number(editingPin.lng ?? editingPin.coordinates?.[1]),
    };

    if (!Number.isFinite(nextCoordinates.lat) || !Number.isFinite(nextCoordinates.lng)) {
      return null;
    }

    return nextCoordinates;
  }, [editingPin]);

  const selectedCoordinates = selectedCoordinatesState ?? routeSelectedCoordinates ?? editingPinCoordinates;
  const isAddPinPanelOpen = isManualAddPinPanelOpen || Boolean(editingPin) || (routeOpenCreate && isAuthenticated);
  const panelMode = editingPin ? 'edit' : 'create';

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
    setEditingPin(null);
    setIsManualAddPinPanelOpen(true);
  }

  function openEditPinPanel(pin) {
    if (!pin) {
      return;
    }

    closeOverlayPanels();
    setSelectedCoordinates(null);
    setCreatedPinId(null);
    setEditingPin(pin);
    setIsManualAddPinPanelOpen(false);
  }

  function closeAddPinPanel() {
    setIsManualAddPinPanelOpen(false);
    setEditingPin(null);
    setSelectedCoordinates(null);
  }

  function handleMapLocationSelect(coordinates) {
    if (!isWithinAzerbaijan(coordinates.lat, coordinates.lng)) {
      setSelectedCoordinates(null);
      setIsManualAddPinPanelOpen(false);
      return;
    }

    setSelectedCoordinates(coordinates);
    setFocusedPinId(editingPin ? editingPin.id : null);
    closeOverlayPanels();

    if (isAuthenticated) {
      if (editingPin) {
        return;
      }

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
    setEditingPin(null);
    setIsManualAddPinPanelOpen(false);
    setSelectedCoordinates(null);
  }

  function handleEditSuccess(nextPinId) {
    setCreatedPinId(null);
    setFocusedPinId(nextPinId);
    setEditingPin(null);
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
    panelMode,
    editingPin,
    routeCreatedPinId,
    openAddPinPanel,
    openEditPinPanel,
    closeAddPinPanel,
    handleMapLocationSelect,
    handleCreateSuccess,
    handleEditSuccess,
    clearCreatedPinState,
  };
}
