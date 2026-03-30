import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  AZERBAIJAN_MAX_BOUNDS,
  DEFAULT_MAP_ZOOM,
  MAP_CENTER_BAKU_LNGLAT,
  MAPBOX_NIGHT_STYLE_URL,
} from '../constants/mapConfig';

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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

export function MapboxMap({
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
  mapStyle = MAPBOX_NIGHT_STYLE_URL,
  mapDepth = '3d',
  showNavigation = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const callbacksRef = useRef({ onMapClick, onMapReady });
  const focusTargetRef = useRef(focusTarget);
  const styleRef = useRef(mapStyle);
  const depthRef = useRef(mapDepth);

  function applyMapDepth(map, nextDepth) {
    const layerId = 'citylayer-3d-buildings';

    try {
      if (typeof map.setConfigProperty === 'function') {
        map.setConfigProperty('basemap', 'show3dObjects', nextDepth === '3d');
      }
    } catch (error) {
      console.warn('CityLayer map depth config fallback triggered:', error);
    }

    try {
      if (nextDepth !== '3d') {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        return;
      }

      if (map.getLayer(layerId) || !map.getSource('composite')) {
        return;
      }

      const firstSymbolLayerId = map
        .getStyle()
        ?.layers?.find((layer) => layer.type === 'symbol' && layer.layout?.['text-field'])?.id;

      map.addLayer(
        {
          id: layerId,
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', ['get', 'extrude'], 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              '#9aa5b1',
              16,
              '#cbd5e1',
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.82,
          },
        },
        firstSymbolLayerId
      );
    } catch (error) {
      console.warn('CityLayer 3D buildings could not be applied:', error);
    }
  }

  useEffect(() => {
    callbacksRef.current = { onMapClick, onMapReady };
  }, [onMapClick, onMapReady]);

  useEffect(() => {
    focusTargetRef.current = focusTarget;
  }, [focusTarget]);

  useEffect(() => {
    depthRef.current = mapDepth;
  }, [mapDepth]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    if (!ACCESS_TOKEN) {
      console.error('CityLayer Mapbox token missing: set VITE_MAPBOX_ACCESS_TOKEN in your environment.');
      return undefined;
    }

    mapboxgl.accessToken = ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleRef.current,
      center: initialCenter,
      zoom: initialZoom,
      minZoom,
      maxZoom,
      maxBounds,
      attributionControl: false,
    });

    if (showNavigation) {
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    }

    map.on('style.load', () => {
      applyMapDepth(map, depthRef.current);
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
            console.error('CityLayer geolocation failed:', error);
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

    return () => {
      callbacksRef.current.onMapReady?.(null);
      markersRef.current.forEach(({ marker, popup }) => {
        popup?.remove();
        marker.remove();
      });
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom, maxBounds, maxZoom, minZoom, showNavigation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleRef.current === mapStyle) {
      return;
    }

    styleRef.current = mapStyle;
    map.setStyle(mapStyle);
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (map.isStyleLoaded()) {
      applyMapDepth(map, mapDepth);
    }
  }, [mapDepth]);

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
      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([previewMarker.lng, previewMarker.lat])
        .addTo(map);

      markersRef.current.push({ marker, popup: null });
    }

    markers.forEach((pin) => {
      const markerClass = `${pin.className}${pin.isSelected ? ' is-selected' : ''}`;
      const { wrapper } = createMarkerElement(markerClass, pin.label);
      const popup = pin.popupNode
        ? new mapboxgl.Popup({ offset: 16, closeButton: true }).setDOMContent(pin.popupNode)
        : null;

      if (popup) {
        popup.on('open', () => pin.onSelect?.());
      }

      const marker = new mapboxgl.Marker({ element: wrapper })
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
    <>
      <div ref={containerRef} className={className} />
      {!ACCESS_TOKEN ? (
        <div className="map-token-alert">
          Missing Mapbox token. Add <code>VITE_MAPBOX_ACCESS_TOKEN</code> to <code>.env</code>.
        </div>
      ) : null}
    </>
  );
}
