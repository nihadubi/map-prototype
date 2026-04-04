import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoryOptions } from '../constants/pinSchema';
import { createPin } from '../../../lib/backend/pinsClient';
import { hasValidationErrors, validatePinForm } from '../utils/pinValidation';

const initialValues = {
  type: 'place',
  title: '',
  description: '',
  category: categoryOptions[0] ?? '',
  lat: '',
  lng: '',
  eventDate: '',
  startTime: '',
  placeType: '',
};

function getCreatePinErrorMessage() {
  return 'Could not create pin. Check your Supabase configuration and table permissions.';
}

function getCreatePinErrorMessageFromError(error) {
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('signed in')) {
    return 'Please sign in again before creating a pin.';
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
    return 'Could not create pin. Check your Supabase permissions and try again.';
  }

  return getCreatePinErrorMessage();
}

export function useAddPinForm({ initialCoordinates = null, user, onSuccess }) {
  const [values, setValues] = useState(() => ({
    ...initialValues,
    lat: initialCoordinates?.lat != null ? String(initialCoordinates.lat) : '',
    lng: initialCoordinates?.lng != null ? String(initialCoordinates.lng) : '',
  }));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setValues((current) => {
      const nextLat = initialCoordinates?.lat != null ? String(initialCoordinates.lat) : '';
      const nextLng = initialCoordinates?.lng != null ? String(initialCoordinates.lng) : '';

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
  }, [initialCoordinates?.lat, initialCoordinates?.lng]);

  const selectedCoordinates = useMemo(() => {
    if (!values.lat || !values.lng) {
      return null;
    }

    return {
      lat: Number(values.lat),
      lng: Number(values.lng),
    };
  }, [values.lat, values.lng]);

  const resetForm = useCallback((coordinates = null) => {
    setValues({
      ...initialValues,
      lat: coordinates?.lat != null ? String(coordinates.lat) : '',
      lng: coordinates?.lng != null ? String(coordinates.lng) : '',
    });
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
      const createdPinId = await createPin(values, user);
      await onSuccess?.(createdPinId, values);
      return createdPinId;
    } catch (error) {
      console.error('Create pin failed:', error);
      setSubmitError(getCreatePinErrorMessageFromError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSuccess, user, values]);

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
