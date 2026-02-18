import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase credentials not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: undefined, // Use default AsyncStorage on React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions
export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

export const handleSupabaseError = (
  error: any,
  fallbackMessage: string = 'Algo salió mal'
): string => {
  if (!error) return fallbackMessage;

  if (error.message) {
    return error.message;
  }

  if (error.status === 401) {
    return 'No autorizado. Por favor, inicia sesión nuevamente.';
  }

  if (error.status === 404) {
    return 'Recurso no encontrado.';
  }

  if (error.status >= 500) {
    return 'Error del servidor. Intenta más tarde.';
  }

  return fallbackMessage;
};

export default supabase;
