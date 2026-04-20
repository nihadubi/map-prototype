import { useEffect, useState } from 'react';

const MAP_SETTINGS_STORAGE_KEY = 'undrpin.mapSettings';
const LEGACY_MAP_SETTINGS_STORAGE_KEY = 'citylayer.mapSettings';

const defaultMapSettings = {
  openCreateOnMapClick: true,
  sidebarExpandOnHover: true,
  animatePreviewPin: true,
};

function readMapSettings() {
  if (typeof window === 'undefined') {
    return defaultMapSettings;
  }

  try {
    const raw = window.localStorage.getItem(MAP_SETTINGS_STORAGE_KEY)
      || window.localStorage.getItem(LEGACY_MAP_SETTINGS_STORAGE_KEY);
    return raw ? { ...defaultMapSettings, ...JSON.parse(raw) } : defaultMapSettings;
  } catch (error) {
    console.error('Failed to read map settings:', error);
    return defaultMapSettings;
  }
}

export function useMapPreferences() {
  const [mapSettings, setMapSettings] = useState(readMapSettings);

  useEffect(() => {
    window.localStorage.setItem(MAP_SETTINGS_STORAGE_KEY, JSON.stringify(mapSettings));
    window.localStorage.removeItem(LEGACY_MAP_SETTINGS_STORAGE_KEY);
  }, [mapSettings]);

  function toggleMapSetting(key, forcedValue) {
    setMapSettings((current) => ({
      ...current,
      [key]: forcedValue ?? !current[key],
    }));
  }

  return {
    mapSettings,
    toggleMapSetting,
  };
}
