import { isSupabaseConfigured, supabase } from '../../supabase/client';

const PROFILE_SETUP_ERROR_CODE = 'profile/not-ready';
const profileReadyPromises = new Map();

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

function createProfileSetupError(message, cause) {
  const error = new Error(message);
  error.code = PROFILE_SETUP_ERROR_CODE;
  error.cause = cause;
  return error;
}

function isMissingProfilesTableError(error) {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();
  const details = String(error?.details || '').toLowerCase();
  const hint = String(error?.hint || '').toLowerCase();

  return (
    code === 'pgrst205'
    || message.includes('relation')
    || message.includes('schema cache')
    || details.includes('profiles')
    || hint.includes('profiles')
  );
}

function logProfileBootstrapFailure(context, error) {
  console.error(context, error, error?.cause ?? null);
}

async function upsertProfileRow(user) {
  const payload = {
    id: user.id,
    display_name: user.user_metadata?.display_name || '',
  };

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

async function verifyProfileRow(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.id) {
    throw createProfileSetupError('Profile row is missing after bootstrap.');
  }

  return data;
}

export async function ensureSupabaseProfile(user, { strict = false } = {}) {
  if (!supabase || !user?.id) {
    return false;
  }

  const cacheKey = `${user.id}:${strict ? 'strict' : 'soft'}`;

  if (profileReadyPromises.has(cacheKey)) {
    return profileReadyPromises.get(cacheKey);
  }

  const readinessPromise = (async () => {
    try {
      await upsertProfileRow(user);
      await verifyProfileRow(user.id);
      return true;
    } catch (error) {
      if (!strict && isMissingProfilesTableError(error)) {
        console.warn('UndrPin profile bootstrap skipped because the profiles table is not ready.', error);
        return false;
      }

      if (isMissingProfilesTableError(error)) {
        throw createProfileSetupError(
          'Profiles table is missing or inaccessible. Run the Supabase profile setup before using authenticated features.',
          error
        );
      }

      if (error?.code === PROFILE_SETUP_ERROR_CODE) {
        throw error;
      }

      throw createProfileSetupError(
        'Your profile could not be prepared for authenticated actions. Check your Supabase policies and try again.',
        error
      );
    } finally {
      profileReadyPromises.delete(cacheKey);
    }
  })();

  profileReadyPromises.set(cacheKey, readinessPromise);
  return readinessPromise;
}

async function ensureProfileForAuthenticatedUser(user) {
  await ensureSupabaseProfile(user, { strict: true });
  return user;
}

async function signOutIfPossible() {
  if (!supabase) {
    return;
  }

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('UndrPin failed to sign out after profile bootstrap error:', error);
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

    let isActive = true;

    async function publishSessionUser(user) {
      if (!isActive) {
        return;
      }

      if (!user) {
        callback(null);
        return;
      }

      try {
        await ensureProfileForAuthenticatedUser(user);
        if (isActive) {
          callback(mapSupabaseUser(user));
        }
      } catch (error) {
        logProfileBootstrapFailure('UndrPin session user profile bootstrap failed:', error);
        await signOutIfPossible();
        if (isActive) {
          callback(null);
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      void publishSessionUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void publishSessionUser(session?.user ?? null);
    });

    return () => {
      isActive = false;
      data.subscription.unsubscribe();
    };
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

      await ensureProfileForAuthenticatedUser(loginResult.data.user);
      return mapSupabaseUser(loginResult.data.user);
    }

    if (data.user) {
      await ensureProfileForAuthenticatedUser(data.user);
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

    try {
      if (data.user) {
        await ensureProfileForAuthenticatedUser(data.user);
      }
    } catch (profileError) {
      await signOutIfPossible();
      throw profileError;
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
