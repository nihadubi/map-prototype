import { supabaseAuthAdapter } from './auth/supabaseAuthAdapter';
import { activeAuthBackendProvider } from './provider';

export function getAuthBackendProvider() {
  return activeAuthBackendProvider;
}

export async function initializeAuthPersistence() {
  await supabaseAuthAdapter.initializePersistence();
}

export function observeAuthState(callback) {
  return supabaseAuthAdapter.observeAuthState(callback);
}

export async function signUp(values) {
  return supabaseAuthAdapter.signUp(values);
}

export async function login(values) {
  return supabaseAuthAdapter.login(values);
}

export async function logout() {
  return supabaseAuthAdapter.logout();
}
