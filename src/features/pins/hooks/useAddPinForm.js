import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPin, updatePin } from '../../../lib/backend/pinsClient';
import { hasValidationErrors, validatePinForm } from '../utils/pinValidation';

const initialValues = {
  type: 'place',
  title: '',
  description: '',
  category: 'community',
  lat: '',
  lng: '',
  eventDate: '',
  startTime: '',
  placeType: '',
};

function getCreatePinErrorMessage() {
  return 'Could not create pin. Check your Supabase configuration and table permissions.';
}

function getUpdatePinErrorMessage() {
  return 'Could not update pin. Check your Supabase configuration and table permissions.';
}

function getPinSubmitErrorMessageFromError(error, mode) {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();

  if (message.includes('signed in')) {
    return `Please sign in again before ${mode === 'edit' ? 'editing' : 'creating'} a pin.`;
  }

  if (message.includes('profile is not ready')) {
    return 'Your account setup is incomplete. Check your database policies and try again.';
  }

  if (
    message.includes('row-level security')
    || message.includes('permission')
    || message.includes('not allowed')
    || message.includes('violates row-level security')
  ) {
    return `${mode === 'edit' ? 'Edit pin is' : 'Create pin is'} blocked by Supabase RLS. Apply the latest schema.sql and make sure pins.created_by matches auth.uid().`;
  }

  if (
    code === 'pgrst205'
    || message.includes('schema cache')
    || message.includes("could not find the table 'public.pins'")
  ) {
    return 'Pins table is missing in Supabase. Run the latest schema.sql on your project.';
  }

  return mode === 'edit' ? getUpdatePinErrorMessage() : getCreatePinErrorMessage();
}

function buildFormValues(initialCoordinates, initialPin) {
  return {
    ...initialValues,
    type: initialPin?.type || initialValues.type,
    title: initialPin?.title || '',
    description: initialPin?.description || '',
    category: initialPin?.category || initialValues.category,
    lat: initialCoordinates?.lat != null ? String(initialCoordinates.lat) : '',
    lng: initialCoordinates?.lng != null ? String(initialCoordinates.lng) : '',
    eventDate: initialPin?.eventDate || '',
    startTime: initialPin?.startTime || '',
    placeType: initialPin?.placeType || '',
  };
}

function getPinCoordinate(pin, axis) {
  if (!pin) {
    return null;
  }

  if (axis === 'lat') {
    return pin.lat ?? pin.coordinates?.[0] ?? null;
  }

  return pin.lng ?? pin.coordinates?.[1] ?? null;
}

export function useAddPinForm({
  initialCoordinates = null,
  initialPin = null,
  mode = 'create',
  user,
  onSuccess,
}) {
  const initialPinId = initialPin?.id ?? null;
  const initialPinType = initialPin?.type ?? initialValues.type;
  const initialPinTitle = initialPin?.title ?? '';
  const initialPinDescription = initialPin?.description ?? '';
  const initialPinCategory = initialPin?.category ?? initialValues.category;
  const initialPinEventDate = initialPin?.eventDate ?? '';
  const initialPinStartTime = initialPin?.startTime ?? '';
  const initialPinPlaceType = initialPin?.placeType ?? '';
  const initialPinLat = getPinCoordinate(initialPin, 'lat');
  const initialPinLng = getPinCoordinate(initialPin, 'lng');
  const initialCoordinateLat = initialCoordinates?.lat ?? null;
  const initialCoordinateLng = initialCoordinates?.lng ?? null;
  const initialPinSnapshot = useMemo(() => (
    initialPinId
      ? {
          id: initialPinId,
          type: initialPinType,
          title: initialPinTitle,
          description: initialPinDescription,
          category: initialPinCategory,
          eventDate: initialPinEventDate,
          startTime: initialPinStartTime,
          placeType: initialPinPlaceType,
          lat: initialPinLat,
          lng: initialPinLng,
        }
      : null
  ), [
    initialPinCategory,
    initialPinDescription,
    initialPinEventDate,
    initialPinId,
    initialPinLat,
    initialPinLng,
    initialPinPlaceType,
    initialPinStartTime,
    initialPinTitle,
    initialPinType,
  ]);

  const resetValues = useMemo(() => buildFormValues(
    {
      lat: initialPinId ? initialPinLat : initialCoordinateLat,
      lng: initialPinId ? initialPinLng : initialCoordinateLng,
    },
    initialPinSnapshot
  ), [
    initialCoordinateLat,
    initialCoordinateLng,
    initialPinId,
    initialPinLat,
    initialPinLng,
    initialPinSnapshot,
  ]);

  const [values, setValues] = useState(() => ({
    ...resetValues,
  }));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setValues(resetValues);
    setErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, [mode, resetValues]);

  useEffect(() => {
    setValues((current) => {
      const nextLat = initialCoordinateLat != null ? String(initialCoordinateLat) : '';
      const nextLng = initialCoordinateLng != null ? String(initialCoordinateLng) : '';

      if (current.lat === nextLat && current.lng === nextLng) {
        return current;
      }

      return {
        ...current,
        lat: nextLat,
        lng: nextLng,
      };
    });

    setErrors((current) => {
      if (!current.lat && !current.lng) {
        return current;
      }

      const next = { ...current };
      delete next.lat;
      delete next.lng;
      return next;
    });
  }, [initialCoordinateLat, initialCoordinateLng]);

  const selectedCoordinates = useMemo(() => {
    if (!values.lat || !values.lng) {
      return null;
    }

    return {
      lat: Number(values.lat),
      lng: Number(values.lng),
    };
  }, [values.lat, values.lng]);

  const resetForm = useCallback((coordinates = null, pin = null) => {
    setValues(buildFormValues(coordinates, pin));
    setErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, []);

  const handleFieldChange = useCallback((event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      if (!current[name] && !(name === 'lat' || name === 'lng')) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      if (name === 'lat' || name === 'lng') {
        delete next.lat;
        delete next.lng;
      }
      return next;
    });
  }, []);

  const handleTypeChange = useCallback((type) => {
    setValues((current) => ({
      ...current,
      type,
      placeType: '',
      eventDate: type === 'event' ? current.eventDate : '',
      startTime: type === 'event' ? current.startTime : '',
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next.type;
      delete next.placeType;
      delete next.eventDate;
      return next;
    });
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setValues((current) => ({ ...current, category }));
    setErrors((current) => {
      const next = { ...current };
      delete next.category;
      return next;
    });
  }, []);

  const handleCoordinateSelect = useCallback((coordinates) => {
    setValues((current) => ({
      ...current,
      lat: String(coordinates.lat),
      lng: String(coordinates.lng),
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next.lat;
      delete next.lng;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return null;
    }

    const nextErrors = validatePinForm(values);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return null;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const nextPinId = mode === 'edit' && initialPinId
        ? initialPinId
        : await createPin(values, user);

      if (mode === 'edit' && initialPinId) {
        await updatePin(initialPinId, values, user);
      }

      await onSuccess?.(nextPinId, values, mode);
      return nextPinId;
    } catch (error) {
      console.error(`${mode === 'edit' ? 'Update' : 'Create'} pin failed:`, error);
      setSubmitError(getPinSubmitErrorMessageFromError(error, mode));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [initialPinId, isSubmitting, mode, onSuccess, user, values]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    selectedCoordinates,
    resetForm,
    handleFieldChange,
    handleTypeChange,
    handleCategoryChange,
    handleCoordinateSelect,
    handleSubmit,
  };
}
