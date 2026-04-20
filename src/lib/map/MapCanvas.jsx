import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_BEARING,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
  MAPLIBRE_DARK_STYLE,
} from '../../features/map/constants/mapConfig';
import { loadMapRuntime } from './mapRuntimeLoader';

const GEOLOCATION_MESSAGES = {
  unsupported: 'This browser cannot access your location.',
  denied: 'Location access is blocked. Allow location permission in your browser settings and try again.',
  unavailable: 'Your location is unavailable right now. Check your device location services and try again.',
  insecure: 'Locate me requires a secure HTTPS connection.',
  timeout: 'Finding your location took too long. Try again in a moment.',
  unknown: 'We could not determine your location right now. Please try again.',
};

const PIN_SOURCE_ID = 'undrpin-pins-source';
const PIN_CIRCLE_LAYER_ID = 'undrpin-pins-circle';
const PIN_SYMBOL_LAYER_ID = 'undrpin-pins-symbol';
const PREVIEW_SOURCE_ID = 'undrpin-preview-source';
const PREVIEW_CIRCLE_LAYER_ID = 'undrpin-preview-circle';
const PREVIEW_SYMBOL_LAYER_ID = 'undrpin-preview-symbol';

function normalizeMapClick(event) {
  return {
    lat: Number(event.lngLat.lat.toFixed(6)),
    lng: Number(event.lngLat.lng.toFixed(6)),
  };
}

function getGeolocationFailure() {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return { code: 'insecure', message: GEOLOCATION_MESSAGES.insecure };
  }

  if (!navigator.geolocation) {
    return { code: 'unsupported', message: GEOLOCATION_MESSAGES.unsupported };
  }

  return null;
}

function mapGeolocationError(error) {
  switch (error?.code) {
    case error?.PERMISSION_DENIED:
    case 1:
      return { code: 'denied', message: GEOLOCATION_MESSAGES.denied };
    case error?.POSITION_UNAVAILABLE:
    case 2:
      return { code: 'unavailable', message: GEOLOCATION_MESSAGES.unavailable };
    case error?.TIMEOUT:
    case 3:
      return { code: 'timeout', message: GEOLOCATION_MESSAGES.timeout };
    default:
      return { code: 'unknown', message: GEOLOCATION_MESSAGES.unknown };
  }
}

function createEmptyFeatureCollection() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

function ensureGeoJsonSource(map, id, data) {
  const source = map.getSource(id);

  if (source) {
    source.setData(data);
    return;
  }

  map.addSource(id, {
    type: 'geojson',
    data,
  });
}

function ensureLayer(map, layerConfig) {
  if (!map.getLayer(layerConfig.id)) {
    map.addLayer(layerConfig);
  }
}

function ensurePinLayers(map, pinData, previewData) {
  ensureGeoJsonSource(map, PIN_SOURCE_ID, pinData);
  ensureGeoJsonSource(map, PREVIEW_SOURCE_ID, previewData);

  ensureLayer(map, {
    id: PIN_CIRCLE_LAYER_ID,
    type: 'circle',
    source: PIN_SOURCE_ID,
    paint: {
      'circle-radius': [
        'case',
        ['boolean', ['get', 'isSelected'], false],
        15,
        11,
      ],
      'circle-color': [
        'match',
        ['get', 'pinType'],
        'event',
        '#00f4fe',
        'place',
        '#ca98ff',
        '#ca98ff',
      ],
      'circle-opacity': 0.95,
      'circle-stroke-width': [
        'case',
        ['boolean', ['get', 'isSelected'], false],
        3,
        2,
      ],
      'circle-stroke-color': [
        'case',
        ['boolean', ['get', 'isSelected'], false],
        '#ffffff',
        [
          'match',
          ['get', 'pinType'],
          'event',
          '#dffcff',
          'place',
          '#f6e8ff',
          '#ffffff',
        ],
      ],
      'circle-blur': [
        'case',
        ['boolean', ['get', 'isSelected'], false],
        0.16,
        0.05,
      ],
    },
  });

  ensureLayer(map, {
    id: PIN_SYMBOL_LAYER_ID,
    type: 'symbol',
    source: PIN_SOURCE_ID,
    layout: {
      'text-field': ['get', 'label'],
      'text-size': [
        'case',
        ['boolean', ['get', 'isSelected'], false],
        13,
        11,
      ],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': 'rgba(6, 10, 16, 0.86)',
      'text-halo-width': 1.4,
    },
  });

  ensureLayer(map, {
    id: PREVIEW_CIRCLE_LAYER_ID,
    type: 'circle',
    source: PREVIEW_SOURCE_ID,
    paint: {
      'circle-radius': ['coalesce', ['get', 'radius'], 14],
      'circle-color': '#b283ff',
      'circle-opacity': 0.9,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff',
      'circle-blur': 0.12,
    },
  });

  ensureLayer(map, {
    id: PREVIEW_SYMBOL_LAYER_ID,
    type: 'symbol',
    source: PREVIEW_SOURCE_ID,
    layout: {
      'text-field': ['get', 'label'],
      'text-size': 14,
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': 'rgba(6, 10, 16, 0.92)',
      'text-halo-width': 1.5,
    },
  });
}

export function MapCanvas({
  className = 'mapbox-map',
  initialCenter = MAP_CENTER_BAKU_LNGLAT,
  initialZoom = DEFAULT_MAP_ZOOM,
  maxBounds = AZERBAIJAN_MAX_BOUNDS,
  minZoom = 7,
  maxZoom = 16,
  onMapClick,
  onPinSelect,
  onMapReady,
  pinFeatures = createEmptyFeatureCollection(),
  previewFeatures = createEmptyFeatureCollection(),
  pinLookup = new Map(),
  focusTarget = null,
  mapStyle = MAPLIBRE_DARK_STYLE,
  showNavigation = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const callbacksRef = useRef({ onMapClick, onMapReady, onPinSelect });
  const focusTargetRef = useRef(focusTarget);
  const styleRef = useRef(mapStyle);
  const styleLoadTimeoutRef = useRef(null);
  const maplibreRef = useRef(null);
  const pinFeaturesRef = useRef(pinFeatures);
  const previewFeaturesRef = useRef(previewFeatures);
  const pinLookupRef = useRef(pinLookup);
  const [isMaplibreReady, setIsMaplibreReady] = useState(false);
  const [isMapMounted, setIsMapMounted] = useState(false);

  const clearStyleLoadTimeout = useCallback(() => {
    if (styleLoadTimeoutRef.current) {
      window.clearTimeout(styleLoadTimeoutRef.current);
      styleLoadTimeoutRef.current = null;
    }
  }, []);

  const startStyleFallbackTimer = useCallback((map, requestedStyle) => {
    clearStyleLoadTimeout();

    if (!requestedStyle || requestedStyle === MAPLIBRE_DARK_STYLE) {
      return;
    }

    styleLoadTimeoutRef.current = window.setTimeout(() => {
      if (!mapRef.current || styleRef.current !== requestedStyle) {
        return;
      }

      console.warn('UndrPin map style fallback triggered, switching to the default dark style.');
      styleRef.current = MAPLIBRE_DARK_STYLE;
      map.setStyle(MAPLIBRE_DARK_STYLE);
    }, 4500);
  }, [clearStyleLoadTimeout]);

  useEffect(() => {
    callbacksRef.current = { onMapClick, onMapReady, onPinSelect };
  }, [onMapClick, onMapReady, onPinSelect]);

  useEffect(() => {
    focusTargetRef.current = focusTarget;
  }, [focusTarget]);

  useEffect(() => {
    pinFeaturesRef.current = pinFeatures;
    pinLookupRef.current = pinLookup;

    const source = mapRef.current?.getSource(PIN_SOURCE_ID);
    if (source) {
      source.setData(pinFeatures);
    }
  }, [pinFeatures, pinLookup]);

  useEffect(() => {
    previewFeaturesRef.current = previewFeatures;

    const source = mapRef.current?.getSource(PREVIEW_SOURCE_ID);
    if (source) {
      source.setData(previewFeatures);
    }
  }, [previewFeatures]);

  useEffect(() => {
    let isActive = true;

    async function loadMaplibre() {
      const runtime = await loadMapRuntime();

      if (!isActive) {
        return;
      }

      maplibreRef.current = runtime;
      setIsMaplibreReady(true);
    }

    void loadMaplibre();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isMaplibreReady || !containerRef.current || mapRef.current || !maplibreRef.current) {
      return undefined;
    }

    const maplibregl = maplibreRef.current;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleRef.current,
      center: initialCenter,
      zoom: initialZoom,
      pitch: DEFAULT_MAP_PITCH,
      bearing: DEFAULT_MAP_BEARING,
      minZoom,
      maxZoom,
      maxBounds,
      attributionControl: false,
    });

    if (showNavigation) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    }

    const syncPinLayers = () => {
      ensurePinLayers(map, pinFeaturesRef.current, previewFeaturesRef.current);
    };

    map.on('style.load', () => {
      clearStyleLoadTimeout();
      syncPinLayers();
    });

    map.on('error', (event) => {
      const message = String(event?.error?.message ?? '').toLowerCase();
      const requestedStyle = styleRef.current;

      if (
        requestedStyle
        && requestedStyle !== MAPLIBRE_DARK_STYLE
        && (
          message.includes('style')
          || message.includes('sprite')
          || message.includes('glyph')
          || message.includes('401')
          || message.includes('403')
        )
      ) {
        console.warn(`UndrPin map style error for "${requestedStyle}", switching to night mode.`, event.error);
        clearStyleLoadTimeout();
        styleRef.current = MAPLIBRE_DARK_STYLE;
        map.setStyle(MAPLIBRE_DARK_STYLE);
      }
    });

    map.on('click', (event) => {
      const renderedPinFeatures = map.queryRenderedFeatures(event.point, {
        layers: [PIN_CIRCLE_LAYER_ID, PIN_SYMBOL_LAYER_ID],
      });

      const clickedFeatureId = renderedPinFeatures[0]?.properties?.id;
      if (clickedFeatureId) {
        const clickedPin = pinLookupRef.current.get(clickedFeatureId);
        if (clickedPin) {
          callbacksRef.current.onPinSelect?.(clickedPin);
          return;
        }
      }

      callbacksRef.current.onMapClick?.(normalizeMapClick(event));
    });

    map.once('load', () => {
      syncPinLayers();
      setIsMapMounted(true);
    });

    const actions = {
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      centerOnBaku: () => map.flyTo({ center: MAP_CENTER_BAKU_LNGLAT, zoom: DEFAULT_MAP_ZOOM, duration: 800 }),
      locateUser: () => new Promise((resolve, reject) => {
        const preflightFailure = getGeolocationFailure();

        if (preflightFailure) {
          reject(preflightFailure);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            map.flyTo({
              center: [coords.longitude, coords.latitude],
              zoom: Math.max(map.getZoom(), 13),
              duration: 800,
            });

            resolve({
              lat: coords.latitude,
              lng: coords.longitude,
            });
          },
          (error) => {
            console.error('UndrPin geolocation failed:', error);
            reject(mapGeolocationError(error));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }),
      focusPin: ({ lng, lat }) => {
        map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 15), duration: 800 });
      },
    };

    callbacksRef.current.onMapReady?.(actions);
    mapRef.current = map;
    startStyleFallbackTimer(map, styleRef.current);

    return () => {
      clearStyleLoadTimeout();
      callbacksRef.current.onMapReady?.(null);
      map.remove();
      mapRef.current = null;
    };
  }, [
    clearStyleLoadTimeout,
    initialCenter,
    initialZoom,
    isMaplibreReady,
    maxBounds,
    maxZoom,
    minZoom,
    showNavigation,
    startStyleFallbackTimer,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleRef.current === mapStyle) {
      return;
    }

    styleRef.current = mapStyle;
    startStyleFallbackTimer(map, mapStyle);
    map.setStyle(mapStyle);
  }, [mapStyle, startStyleFallbackTimer]);

  useEffect(() => {
    const map = mapRef.current;
    const target = focusTargetRef.current;

    if (!map || !target) {
      return;
    }

    map.flyTo({
      center: [target.lng, target.lat],
      zoom: Math.max(map.getZoom(), 15),
      duration: 800,
    });
  }, [focusTarget?.id, focusTarget?.lat, focusTarget?.lng]);

  return (
    <div className="map-canvas">
      <div ref={containerRef} className={className} />
      {!isMaplibreReady || !isMapMounted ? (
        <div className="map-canvas-loading" aria-hidden="true">
          <div className="map-canvas-loading-grid" />
          <div className="map-canvas-loading-card">
            <span className="map-canvas-loading-kicker">Map Loading</span>
            <strong>Preparing the city layer</strong>
            <span>Markers and controls will appear here in a moment.</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
