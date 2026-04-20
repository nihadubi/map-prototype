import { preloadMapRuntime } from '../../../lib/map/mapRuntimeLoader';

let cityMapModulePromise;

export function loadCityMapModule() {
  if (!cityMapModulePromise) {
    cityMapModulePromise = import('../components/CityMap');
  }

  return cityMapModulePromise;
}

export function preloadCityMap() {
  void loadCityMapModule();
  preloadMapRuntime();
}
