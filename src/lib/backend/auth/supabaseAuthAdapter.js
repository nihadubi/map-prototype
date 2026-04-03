import { isSupabaseConfigured, supabase } from '../../supabase/client';

function mapSupabaseUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    uid: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.display_name || '',
    rawUser: user,
  };
}

async function bootstrapProfile(user) {
  if (!supabase || !user) {
    return;
  }

  const payload = {
    id: user.id,
    display_name: user.user_metadata?.display_name || '',
  };

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    const message = String(error.message || '').toLowerCase();
    const details = String(error.details || '').toLowerCase();

    if (
      message.includes('relation')
      || message.includes('schema cache')
      || details.includes('profiles')
    ) {
      return;
    }

    throw error;
  }
}

export const supabaseAuthAdapter = {
  async initializePersistence() {
    return undefined;
  },

  observeAuthState(callback) {
    if (!supabase) {
      callback(null);
      return () => {};
    }

    supabase.auth.getSession().then(({ data }) => {
      callback(mapSupabaseUser(data.session?.user ?? null));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(mapSupabaseUser(session?.user ?? null));
    });

    return () => data.subscription.unsubscribe();
  },

  async signUp(values) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase auth is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          display_name: values.displayName || '',
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      await bootstrapProfile(data.user);
    }

    if (!data.session && data.user) {
      const loginResult = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (loginResult.error) {
        const confirmationError = new Error('Please confirm your email before logging in.');
        confirmationError.code = 'auth/email-not-confirmed';
        throw confirmationError;
      }

      return mapSupabaseUser(loginResult.data.user);
    }

    return mapSupabaseUser(data.user);
  },

  async login(values) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase auth is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      await bootstrapProfile(data.user);
    }

    return mapSupabaseUser(data.user);
  },

  async logout() {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },
};
