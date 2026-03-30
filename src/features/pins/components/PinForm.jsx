import { useMemo, useState } from 'react';
import {
  categoryOptions,
  pinDocumentShape,
  pinTypeOptions,
  placeTypeOptions,
} from '../constants/pinSchema';
import { hasValidationErrors, validatePinForm } from '../utils/pinValidation';

const initialValues = {
  type: 'event',
  title: '',
  description: '',
  category: '',
  lat: '',
  lng: '',
  eventDate: '',
  startTime: '',
  placeType: '',
};

export function PinForm({ initialCoordinates, onSubmit, isSubmitting, submitError }) {
  const [values, setValues] = useState(() => ({
    ...initialValues,
    lat: initialCoordinates?.lat ?? '',
    lng: initialCoordinates?.lng ?? '',
  }));
  const [errors, setErrors] = useState({});

  const documentShapePreview = useMemo(() => JSON.stringify(pinDocumentShape, null, 2), []);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === 'type' && value === 'event' ? { placeType: '' } : {}),
      ...(name === 'type' && value === 'place' ? { eventDate: '', startTime: '' } : {}),
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validatePinForm(values);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <div className="pin-form-grid">
      <form className="card stack pin-form" onSubmit={handleSubmit}>
        <div className="stack-sm">
          <h2 className="section-title">Create a new pin</h2>
          <p className="muted">Add a place or event to the community map.</p>
        </div>

        <label className="stack-sm" htmlFor="type">
          <span>Pin type</span>
          <select id="type" name="type" value={values.type} onChange={handleChange} disabled={isSubmitting}>
            {pinTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type ? <span className="field-error">{errors.type}</span> : null}
        </label>

        <label className="stack-sm" htmlFor="title">
          <span>Title</span>
          <input id="title" name="title" type="text" value={values.title} onChange={handleChange} disabled={isSubmitting} />
          {errors.title ? <span className="field-error">{errors.title}</span> : null}
        </label>

        <label className="stack-sm" htmlFor="description">
          <span>Description</span>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={values.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </label>

        <label className="stack-sm" htmlFor="category">
          <span>Category</span>
          <input
            id="category"
            name="category"
            type="text"
            list="pin-categories"
            value={values.category}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <datalist id="pin-categories">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          {errors.category ? <span className="field-error">{errors.category}</span> : null}
        </label>

        <div className="two-column-grid">
          <label className="stack-sm" htmlFor="lat">
            <span>Latitude</span>
            <input id="lat" name="lat" type="number" step="any" value={values.lat} onChange={handleChange} disabled={isSubmitting} />
            {errors.lat ? <span className="field-error">{errors.lat}</span> : null}
          </label>

          <label className="stack-sm" htmlFor="lng">
            <span>Longitude</span>
            <input id="lng" name="lng" type="number" step="any" value={values.lng} onChange={handleChange} disabled={isSubmitting} />
            {errors.lng ? <span className="field-error">{errors.lng}</span> : null}
          </label>
        </div>

        {values.type === 'event' ? (
          <div className="two-column-grid">
            <label className="stack-sm" htmlFor="eventDate">
              <span>Event date</span>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={values.eventDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.eventDate ? <span className="field-error">{errors.eventDate}</span> : null}
            </label>

            <label className="stack-sm" htmlFor="startTime">
              <span>Start time (optional)</span>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={values.startTime}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </label>
          </div>
        ) : (
          <label className="stack-sm" htmlFor="placeType">
            <span>Place type</span>
            <select
              id="placeType"
              name="placeType"
              value={values.placeType}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select place type</option>
              {placeTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.placeType ? <span className="field-error">{errors.placeType}</span> : null}
          </label>
        )}

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving pin...' : 'Create pin'}
        </button>
      </form>

      <aside className="card stack-sm pin-schema-panel">
        <h2 className="section-title">Firestore document shape</h2>
        <p className="muted">Each document in the `pins` collection will use this MVP shape.</p>
        <pre className="schema-preview">{documentShapePreview}</pre>
      </aside>
    </div>
  );
}
