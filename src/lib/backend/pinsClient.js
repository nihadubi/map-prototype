import { supabasePinsAdapter } from './pins/supabasePinsAdapter';

export function subscribeToPins(onUpdate, onError) {
  return supabasePinsAdapter.subscribeToPins(onUpdate, onError);
}

export async function createPin(values, user) {
  return supabasePinsAdapter.createPin(values, user);
}
