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

function isMissingProfilesTableError(error) {
  const message = String(error?.message || '').toLowerCase();
  const details = String(error?.details || '').toLowerCase();

  return (
    message.includes('relation')
    || message.includes('schema cache')
    || details.includes('profiles')
  );
}

export async function ensureSupabaseProfile(user, { strict = false } = {}) {
  if (!supabase || !user) {
    return false;
  }

  const payload = {
    id: user.id,
    display_name: user.user_metadata?.display_name || '',
  };

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    if (!strict && isMissingProfilesTableError(error)) {
      console.warn('UndrPin profile bootstrap skipped because the profiles table is not ready.', error);
      return false;
    }

    throw error;
  }

  return true;
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
      try {
        await ensureSupabaseProfile(data.user);
      } catch (profileError) {
        console.warn('UndrPin profile bootstrap failed after signup.', profileError);
      }
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
      try {
        await ensureSupabaseProfile(data.user);
      } catch (profileError) {
        console.warn('UndrPin profile bootstrap failed after login.', profileError);
      }
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
