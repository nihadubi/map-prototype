import { supabasePinsAdapter } from './pins/supabasePinsAdapter';

export function subscribeToPins(onUpdate, onError) {
  return supabasePinsAdapter.subscribeToPins(onUpdate, onError);
}

export async function createPin(values, user) {
  return supabasePinsAdapter.createPin(values, user);
}

export async function getSavedPinIds(user) {
  return supabasePinsAdapter.getSavedPinIds(user);
}

export async function savePin(pinId, user) {
  return supabasePinsAdapter.savePin(pinId, user);
}

export async function removeSavedPin(pinId, user) {
  return supabasePinsAdapter.removeSavedPin(pinId, user);
}

export async function mergeLegacySavedPins(pinIds, user) {
  return supabasePinsAdapter.mergeLegacySavedPins(pinIds, user);
}
