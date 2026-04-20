import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getSavedPinIds,
  mergeLegacySavedPins,
  removeSavedPin,
  savePin,
} from '../../../lib/backend/pinsClient';

const SAVED_PINS_STORAGE_KEY = 'undrpin.savedPins';
const LEGACY_SAVED_PINS_STORAGE_KEY = 'citylayer.savedPins';

function readLegacySavedPinIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_PINS_STORAGE_KEY)
      || window.localStorage.getItem(LEGACY_SAVED_PINS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (error) {
    console.error('Failed to read legacy saved pins:', error);
    return [];
  }
}

function clearLegacySavedPinIds() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SAVED_PINS_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_SAVED_PINS_STORAGE_KEY);
}

function getSavedPinsErrorMessage(error) {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();

  if (message.includes('signed in')) {
    return 'Please sign in to save pins.';
  }

  if (
    code === 'pgrst205'
    || message.includes('schema cache')
    || message.includes("could not find the table 'public.saved_pins'")
  ) {
    return 'Saved pins table is missing in Supabase. Run the latest schema.sql on your project.';
  }

  if (
    message.includes('row-level security')
    || message.includes('permission')
    || message.includes('not allowed')
    || message.includes('violates row-level security')
  ) {
    return 'Saved pins are not available right now. Check your Supabase permissions.';
  }

  if (message.includes('supabase client is not configured')) {
    return 'Saved pins are not configured yet. Add your Supabase keys to continue.';
  }

  return 'Saved pins could not be updated right now. Please try again.';
}

export function useSavedPins({
  user,
  isAuthenticated,
  isAuthLoading,
  pins,
  isPinsReady,
  navigate,
  returnToPath,
}) {
  const [savedPinIds, setSavedPinIds] = useState([]);
  const [isSavedPinsLoading, setIsSavedPinsLoading] = useState(false);
  const [savedPinsError, setSavedPinsError] = useState('');
  const migrationAttemptedRef = useRef(new Set());

  const activePinIds = useMemo(
    () => new Set((pins || []).map((pin) => pin.id).filter(Boolean)),
    [pins]
  );

  useEffect(() => {
    let isActive = true;

    async function loadSavedPins() {
      if (isAuthLoading) {
        return;
      }

      if (!isAuthenticated || !user) {
        setSavedPinIds([]);
        setIsSavedPinsLoading(false);
        setSavedPinsError('');
        return;
      }

      setIsSavedPinsLoading(true);
      setSavedPinsError('');

      try {
        const nextSavedPinIds = await getSavedPinIds(user);

        if (isActive) {
          setSavedPinIds(nextSavedPinIds);
        }
      } catch (error) {
        console.error('Failed to load saved pins:', error);
        if (isActive) {
          setSavedPinIds([]);
          setSavedPinsError(getSavedPinsErrorMessage(error));
        }
      } finally {
        if (isActive) {
          setIsSavedPinsLoading(false);
        }
      }
    }

    void loadSavedPins();

    return () => {
      isActive = false;
    };
  }, [isAuthLoading, isAuthenticated, user]);

  useEffect(() => {
    let isActive = true;

    async function migrateLegacySavedPins() {
      if (isAuthLoading || !isAuthenticated || !user || !isPinsReady) {
        return;
      }

      const userId = user.id || user.uid;
      if (!userId || migrationAttemptedRef.current.has(userId)) {
        return;
      }

      const legacySavedPinIds = readLegacySavedPinIds();
      migrationAttemptedRef.current.add(userId);

      if (legacySavedPinIds.length === 0) {
        return;
      }

      const validLegacyPinIds = [...new Set(legacySavedPinIds)].filter((pinId) => activePinIds.has(pinId));

      try {
        if (validLegacyPinIds.length > 0) {
          await mergeLegacySavedPins(validLegacyPinIds, user);
          const nextSavedPinIds = await getSavedPinIds(user);

          if (isActive) {
            setSavedPinIds(nextSavedPinIds);
          }
        }

        clearLegacySavedPinIds();
      } catch (error) {
        console.error('Failed to migrate legacy saved pins:', error);
        if (isActive) {
          setSavedPinsError(getSavedPinsErrorMessage(error));
        }
      }
    }

    void migrateLegacySavedPins();

    return () => {
      isActive = false;
    };
  }, [activePinIds, isAuthLoading, isAuthenticated, isPinsReady, user]);

  async function toggleSavedPin(pinId) {
    if (!pinId) {
      return;
    }

    if (!isAuthenticated || !user) {
      navigate('/auth', { state: { from: returnToPath } });
      return;
    }

    const isCurrentlySaved = savedPinIds.includes(pinId);
    const nextSavedPinIds = isCurrentlySaved
      ? savedPinIds.filter((currentPinId) => currentPinId !== pinId)
      : [...savedPinIds, pinId];

    setSavedPinsError('');
    setSavedPinIds(nextSavedPinIds);

    try {
      if (isCurrentlySaved) {
        await removeSavedPin(pinId, user);
      } else {
        await savePin(pinId, user);
      }
    } catch (error) {
      console.error('Failed to update saved pins:', error);
      setSavedPinIds(savedPinIds);
      setSavedPinsError(getSavedPinsErrorMessage(error));
    }
  }

  return {
    savedPinIds,
    isSavedPinsLoading,
    savedPinsError,
    toggleSavedPin,
  };
}
