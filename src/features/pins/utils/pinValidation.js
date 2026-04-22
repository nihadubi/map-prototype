import { isWithinAzerbaijan } from '../../map/utils/azerbaijanBounds';

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

export function validatePinForm(values) {
  const errors = {};

  if (!values.type) {
    errors.type = 'Select a pin type.';
  }

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!isFiniteNumber(values.lat)) {
    errors.lat = 'Latitude must be a valid number.';
  } else if (Number(values.lat) < -90 || Number(values.lat) > 90) {
    errors.lat = 'Latitude must be between -90 and 90.';
  }

  if (!isFiniteNumber(values.lng)) {
    errors.lng = 'Longitude must be a valid number.';
  } else if (Number(values.lng) < -180 || Number(values.lng) > 180) {
    errors.lng = 'Longitude must be between -180 and 180.';
  } else if (!isWithinAzerbaijan(values.lat, values.lng)) {
    errors.lat = 'Pins can only be placed inside Azerbaijan.';
  }

  if (values.type === 'event' && !values.eventDate) {
    errors.eventDate = 'Event date is required for event pins.';
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
