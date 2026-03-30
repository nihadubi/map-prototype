import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { PinForm } from '../components/PinForm';
import { createPin } from '../services/pins.service';

function getCreatePinErrorMessage() {
  return 'Could not create pin. Check your Firebase config and Firestore permissions.';
}

export function AddPinPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleCreatePin(values) {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const createdPinId = await createPin(values, user);
      navigate(`/?createdPinId=${createdPinId}`);
    } catch (error) {
      console.error('Create pin failed:', error);
      setSubmitError(getCreatePinErrorMessage());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="stack">
      <div className="stack-sm">
        <h1>Add a pin</h1>
        <p className="muted">
          Create an event or place pin. On submit, the new Firestore document will appear back on the map.
        </p>
      </div>

      <div className="card stack-sm">
        <p>
          Signed in as <strong>{user?.displayName || user?.email}</strong>
        </p>
        <p className="muted">Coordinates can be typed manually now, and later we will prefill them from the map click flow.</p>
      </div>

      <PinForm onSubmit={handleCreatePin} isSubmitting={isSubmitting} submitError={submitError} />
    </section>
  );
}
