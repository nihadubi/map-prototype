let mapRuntimePromise;

export async function loadMapRuntime() {
  if (!mapRuntimePromise) {
    mapRuntimePromise = import('maplibre-gl').then((module) => module.default);
  }

  return mapRuntimePromise;
}

export function preloadMapRuntime() {
  void loadMapRuntime();
}
