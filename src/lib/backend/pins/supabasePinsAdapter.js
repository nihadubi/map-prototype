import { supabase } from '../../supabase/client';

const PINS_REFRESH_EVENT = 'undrpin:pins-refresh';

function mapSupabasePin(row) {
  const createdBy =
    row.created_by_display_name
    || row.display_name
    || row.created_by_name
    || row.created_by
    || 'UndrPin member';

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    category: row.category,
    city: row.city_slug || 'baku',
    coordinates: [row.lat, row.lng],
    lat: row.lat,
    lng: row.lng,
    createdBy,
    createdAtLabel: row.created_at ? new Date(row.created_at).toLocaleString() : 'Just now',
    createdAt: row.created_at,
    eventDate: row.event_date || null,
    startTime: row.start_time || null,
    placeType: row.place_type || null,
    status: row.status || 'active',
  };
}

export const supabasePinsAdapter = {
  subscribeToPins(onUpdate, onError) {
    if (!supabase) {
      onError?.(new Error('Supabase client is not configured.'));
      return () => {};
    }

    let isActive = true;

    async function loadPins() {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        onError?.(error);
        return;
      }

      if (isActive) {
        onUpdate((data || []).map(mapSupabasePin).filter((pin) => pin.status !== 'archived'));
      }
    }

    loadPins();

    function handlePinsRefresh() {
      void loadPins();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(PINS_REFRESH_EVENT, handlePinsRefresh);
    }

    const channel = supabase
      .channel('pins-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pins' }, () => {
        void loadPins();
      })
      .subscribe();

    return () => {
      isActive = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener(PINS_REFRESH_EVENT, handlePinsRefresh);
      }
      void supabase.removeChannel(channel);
    };
  },

  async createPin(values, user) {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const payload = {
      type: values.type,
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      city_slug: 'baku',
      lat: Number(values.lat),
      lng: Number(values.lng),
      created_by: user?.id || user?.uid || null,
      status: 'active',
      event_date: values.type === 'event' ? values.eventDate : null,
      start_time: values.type === 'event' ? values.startTime || null : null,
      place_type: values.type === 'place' ? values.placeType.trim() || null : null,
    };

    const { data, error } = await supabase.from('pins').insert(payload).select('id').single();

    if (error) {
      throw error;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PINS_REFRESH_EVENT));
    }

    return data.id;
  },
};
