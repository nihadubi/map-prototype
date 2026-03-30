import {
  GeoPoint,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

const pinsCollection = collection(db, 'pins');

function formatCreatedAt(createdAt) {
  if (!createdAt?.toDate) {
    return 'Just now';
  }

  return createdAt.toDate().toLocaleString();
}

export function mapPinDocument(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    type: data.type,
    title: data.title,
    description: data.description,
    category: data.category,
    city: data.city,
    coordinates: [data.lat, data.lng],
    lat: data.lat,
    lng: data.lng,
    createdBy: data.createdBy?.displayName || data.createdBy?.email || 'Anonymous',
    createdAtLabel: formatCreatedAt(data.createdAt),
    createdAt: data.createdAt,
    eventDate: data.eventDate || null,
    startTime: data.startTime || null,
    placeType: data.placeType || null,
    status: data.status,
  };
}

export function subscribeToPins(onUpdate, onError) {
  const pinsQuery = query(pinsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    pinsQuery,
    (snapshot) => {
      const pins = snapshot.docs.map(mapPinDocument).filter((pin) => pin.status !== 'archived');
      onUpdate(pins);
    },
    onError
  );
}

export async function createPin(values, user) {
  const payload = {
    type: values.type,
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    city: 'baku',
    location: new GeoPoint(Number(values.lat), Number(values.lng)),
    lat: Number(values.lat),
    lng: Number(values.lng),
    createdBy: {
      uid: user.uid,
      displayName: user.displayName || 'CityLayer user',
      email: user.email || '',
    },
    createdAt: serverTimestamp(),
    status: 'active',
    eventDate: values.type === 'event' ? values.eventDate : null,
    startTime: values.type === 'event' ? values.startTime || null : null,
    placeType: values.type === 'place' ? values.placeType.trim() : null,
  };

  const docRef = await addDoc(pinsCollection, payload);
  return docRef.id;
}
