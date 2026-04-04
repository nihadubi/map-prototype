import { useEffect, useState } from 'react';

const SAVED_PINS_STORAGE_KEY = 'citylayer.savedPins';
const MAP_SETTINGS_STORAGE_KEY = 'citylayer.mapSettings';

const defaultMapSettings = {
  openCreateOnMapClick: true,
  sidebarExpandOnHover: true,
  animatePreviewPin: true,
};

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

function readMapSettings() {
  if (typeof window === 'undefined') {
    return defaultMapSettings;
  }

  try {
    const raw = window.localStorage.getItem(MAP_SETTINGS_STORAGE_KEY);
    return raw ? { ...defaultMapSettings, ...JSON.parse(raw) } : defaultMapSettings;
  } catch (error) {
    console.error('Failed to read map settings:', error);
    return defaultMapSettings;
  }
}

export function useMapPreferences() {
  const [savedPinIds, setSavedPinIds] = useState(readSavedPinIds);
  const [mapSettings, setMapSettings] = useState(readMapSettings);

  useEffect(() => {
    window.localStorage.setItem(SAVED_PINS_STORAGE_KEY, JSON.stringify(savedPinIds));
  }, [savedPinIds]);

  useEffect(() => {
    window.localStorage.setItem(MAP_SETTINGS_STORAGE_KEY, JSON.stringify(mapSettings));
  }, [mapSettings]);

  function toggleSavedPin(pinId) {
    setSavedPinIds((current) => (
      current.includes(pinId)
        ? current.filter((id) => id !== pinId)
        : [...current, pinId]
    ));
  }

  function toggleMapSetting(key, forcedValue) {
    setMapSettings((current) => ({
      ...current,
      [key]: forcedValue ?? !current[key],
    }));
  }

  return {
    savedPinIds,
    mapSettings,
    toggleSavedPin,
    toggleMapSetting,
  };
}
