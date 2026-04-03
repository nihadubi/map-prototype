export const MAP_CENTER_BAKU = [40.4093, 49.8671];
export const MAP_CENTER_BAKU_LNGLAT = [49.8671, 40.4093];
export const DEFAULT_MAP_ZOOM = 10.5;
export const MAP_MAX_BOUNDS_VISCOSITY = 0.35;
export const DEFAULT_MAP_PITCH = 42;
export const DEFAULT_MAP_BEARING = -12;
export const MAPLIBRE_DARK_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
    },
  ],
};

export const AZERBAIJAN_BOUNDS = [
  [37.8, 43.9],
  [42.35, 52.1],
];

export const AZERBAIJAN_MAX_BOUNDS = [
  [43.9, 37.8],
  [52.1, 42.35],
];
