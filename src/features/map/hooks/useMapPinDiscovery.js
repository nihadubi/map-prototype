import { useDeferredValue, useMemo, useState, useTransition } from 'react';

function matchesSearch(pin, query) {
  if (!query) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  return [pin.title, pin.description, pin.category, pin.eventDate]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

export function useMapPinDiscovery({
  pins,
  savedPinIds,
  isSavedPinsLoading = false,
  createdPinId,
  routeCreatedPinId,
  isAddPinPanelOpen,
}) {
  const [activeSection, setActiveSection] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [isSearchPending, startSearchTransition] = useTransition();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const basePins = useMemo(() => {
    switch (activeSection) {
      case 'events':
        return pins.filter((pin) => pin.type === 'event');
      case 'saved':
        return pins.filter((pin) => savedPinIds.includes(pin.id));
      case 'discover':
      default:
        return pins;
    }
  }, [activeSection, pins, savedPinIds]);

  const visiblePins = useMemo(() => {
    return basePins.filter((pin) => matchesSearch(pin, deferredSearchQuery));
  }, [basePins, deferredSearchQuery]);

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

    return null;
  }, [createdPin, selectedPinId, visiblePins]);

  const selectedPin = useMemo(() => {
    return visiblePins.find((pin) => pin.id === effectiveSelectedPinId)
      || pins.find((pin) => pin.id === effectiveSelectedPinId)
      || null;
  }, [effectiveSelectedPinId, pins, visiblePins]);

  const shouldShowNoResults = !isAddPinPanelOpen
    && pins.length > 0
    && visiblePins.length === 0
    && !(activeSection === 'saved' && isSavedPinsLoading);

  const sectionMeta = useMemo(() => ({
    discover: `${pins.length}`,
    events: `${pins.filter((pin) => pin.type === 'event').length}`,
    saved: `${savedPinIds.filter((id) => pins.some((pin) => pin.id === id)).length}`,
  }), [pins, savedPinIds]);

  function handleSectionChange(section) {
    setActiveSection(section);
    setSearchQuery('');
  }

  function handleSearchQueryChange(value) {
    startSearchTransition(() => {
      setSearchQuery(value);
    });
  }

  return {
    activeSection,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    isSearchPending,
    selectedPinId,
    setSelectedPinId,
    visiblePins,
    createdPin,
    effectiveSelectedPinId,
    selectedPin,
    shouldShowNoResults,
    sectionMeta,
    handleSectionChange,
  };
}
