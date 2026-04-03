import { useCallback, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_BEARING,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
  MAPLIBRE_DARK_STYLE,
} from '../../features/map/constants/mapConfig';

function createMarkerElement(className, label) {
  const wrapper = document.createElement('div');
  wrapper.className = 'map-marker-wrapper';

  const marker = document.createElement('span');
  marker.className = className;
  marker.textContent = label;

  wrapper.appendChild(marker);
  return { wrapper, marker };
}

function normalizeMapClick(event) {
  return {
    lat: Number(event.lngLat.lat.toFixed(6)),
    lng: Number(event.lngLat.lng.toFixed(6)),
  };
}

export function MapCanvas({
  className = 'mapbox-map',
  initialCenter = MAP_CENTER_BAKU_LNGLAT,
  initialZoom = DEFAULT_MAP_ZOOM,
  maxBounds = AZERBAIJAN_MAX_BOUNDS,
  minZoom = 7,
  maxZoom = 16,
  onMapClick,
  onMapReady,
  markers = [],
  previewMarker = null,
  focusTarget = null,
  mapStyle = MAPLIBRE_DARK_STYLE,
  showNavigation = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const callbacksRef = useRef({ onMapClick, onMapReady });
  const focusTargetRef = useRef(focusTarget);
  const styleRef = useRef(mapStyle);
  const styleLoadTimeoutRef = useRef(null);

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
    callbacksRef.current = { onMapClick, onMapReady };
  }, [onMapClick, onMapReady]);

  useEffect(() => {
    focusTargetRef.current = focusTarget;
  }, [focusTarget]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

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

    map.on('style.load', () => {
      clearStyleLoadTimeout();
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
      callbacksRef.current.onMapClick?.(normalizeMapClick(event));
    });

    const actions = {
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      centerOnBaku: () => map.flyTo({ center: MAP_CENTER_BAKU_LNGLAT, zoom: DEFAULT_MAP_ZOOM, duration: 800 }),
      locateUser: () => {
        if (!navigator.geolocation) {
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            map.flyTo({
              center: [coords.longitude, coords.latitude],
              zoom: Math.max(map.getZoom(), 13),
              duration: 800,
            });
          },
          (error) => {
            console.error('UndrPin geolocation failed:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      },
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
      markersRef.current.forEach(({ marker, popup }) => {
        popup?.remove();
        marker.remove();
      });
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [
    clearStyleLoadTimeout,
    initialCenter,
    initialZoom,
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
    if (!map) {
      return;
    }

    markersRef.current.forEach(({ marker, popup }) => {
      popup?.remove();
      marker.remove();
    });
    markersRef.current = [];

    if (previewMarker) {
      const { wrapper } = createMarkerElement(previewMarker.className, previewMarker.label);
      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([previewMarker.lng, previewMarker.lat])
        .addTo(map);

      markersRef.current.push({ marker, popup: null });
    }

    markers.forEach((pin) => {
      const markerClass = `${pin.className}${pin.isSelected ? ' is-selected' : ''}`;
      const { wrapper } = createMarkerElement(markerClass, pin.label);
      const popup = pin.popupNode
        ? new maplibregl.Popup({ offset: 16, closeButton: true }).setDOMContent(pin.popupNode)
        : null;

      if (popup) {
        popup.on('open', () => pin.onSelect?.());
      }

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([pin.lng, pin.lat]);

      if (popup) {
        marker.setPopup(popup);
      }

      wrapper.addEventListener('click', () => pin.onSelect?.());
      marker.addTo(map);

      if (pin.isSelected && popup) {
        marker.togglePopup();
      }

      markersRef.current.push({ marker, popup });
    });
  }, [markers, previewMarker]);

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
    <div ref={containerRef} className={className} />
  );
}
