import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from '../__mocks__/supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Use mock if no real credentials
let supabase: any;

if (isConfigured) {
  console.log('✅ Using real Supabase client');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  console.log('⚠️  Using MOCK Supabase client (development mode)');
  supabase = mockSupabase;
}

// Helper functions
export const isSupabaseConfigured = (): boolean => isConfigured;

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
