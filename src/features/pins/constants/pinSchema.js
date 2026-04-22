export const pinDocumentShape = {
  type: 'event | place',
  title: 'string',
  description: 'string',
  category: 'string',
  city: 'baku',
  location: 'GeoPoint',
  lat: 'number',
  lng: 'number',
  createdBy: {
    uid: 'string',
    displayName: 'string',
    email: 'string',
  },
  createdAt: 'serverTimestamp',
  status: 'active',
  eventDate: 'string | null',
  startTime: 'string | null',
  placeType: 'string | null',
};

export const pinTypeOptions = [
  { value: 'event', label: 'Event' },
  { value: 'place', label: 'Place' },
];

export const categoryOptions = [
  'music',
  'food',
  'culture',
  'film',
  'outdoors',
  'hidden gem',
  'community',
  'viewpoint',
];

export const placeTypeOptions = ['cafe', 'park', 'viewpoint', 'food', 'hidden gem', 'other'];
