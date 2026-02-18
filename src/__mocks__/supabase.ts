/**
 * Mock Supabase Client para desarrollo y testing
 * Simula respuestas de Supabase sin conexión real
 */

import { User, AuthSession, LoginCredentials, SignUpData } from '../types';

// Mock users database
const mockUsers: Record<string, User> = {
  'user-0123': {
    id: 'user-0123',
    email: 'demo@example.com',
    username: 'demousuario',
    display_name: 'Usuario Demo',
    bio: 'Esta es mi bio de demostración',
    avatar_url: null,
    website: null,
    is_private: false,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

// Simulated session storage
let currentSession: AuthSession | null = null;

export const mockSupabase = {
  auth: {
    signUp: async (data: { email: string; password: string; options?: any }) => {
      console.log('[MOCK] signup:', data.email);
      await new Promise((r) => setTimeout(r, 500)); // Simulate network delay

      // Validation
      if (!data.email || !data.password) {
        return {
          data: null,
          error: new Error('Email and password required'),
        };
      }

      if (data.password.length < 6) {
        return {
          data: null,
          error: new Error('Password must be at least 6 characters'),
        };
      }

      // Generate mock user
      const newUserId = `user-${Date.now()}`;
      const newUser: any = {
        id: newUserId,
        email: data.email,
        user_metadata: data.options?.data || {},
      };

      // Create profile in mock database
      mockUsers[newUserId] = {
        id: newUserId,
        email: data.email,
        username: data.options?.data?.username || data.email.split('@')[0],
        display_name: data.options?.data?.display_name || 'New User',
        bio: null,
        avatar_url: null,
        website: null,
        is_private: false,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      };
    },

    signInWithPassword: async (data: LoginCredentials) => {
      console.log('[MOCK] signIn:', data.email);
      await new Promise((r) => setTimeout(r, 800)); // Simulate network delay

      // Mock validation
      if (!data.email || !data.password) {
        return {
          data: null,
          error: new Error('Invalid credentials'),
        };
      }

      // For demo, any email/password works
      // In real app, this would validate against Supabase
      const demoEmail = 'demo@example.com';
      const demoPassword = 'password123';

      let mockUser: any;
      if (data.email === demoEmail && data.password === demoPassword) {
        // Return demo user
        mockUser = mockUsers['user-0123'];
      } else {
        // Return a generated user for any other credentials (for testing)
        const testUserId = `user-test-${Date.now()}`;
        mockUser = {
          id: testUserId,
          email: data.email,
          username: data.email.split('@')[0],
          display_name: data.email.split('@')[0],
          bio: null,
          avatar_url: null,
          website: null,
          is_private: false,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockUsers[testUserId] = mockUser;
      }

      const fakeSession: any = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
        access_token: `fake-jwt-${Date.now()}`,
        refresh_token: `fake-refresh-${Date.now()}`,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        expires_in: 3600,
        token_type: 'bearer',
      };

      currentSession = {
        user: mockUser,
        access_token: fakeSession.access_token,
        refresh_token: fakeSession.refresh_token,
        expires_at: fakeSession.expires_at,
      };

      return {
        data: { session: fakeSession, user: fakeSession.user },
        error: null,
      };
    },

    signOut: async () => {
      console.log('[MOCK] signOut');
      await new Promise((r) => setTimeout(r, 300));
      currentSession = null;
      return { error: null };
    },

    getUser: async () => {
      console.log('[MOCK] getUser');
      if (currentSession) {
        return {
          data: { user: currentSession.user },
          error: null,
        };
      }
      return { data: { user: null }, error: null };
    },

    refreshSession: async (data: { refresh_token: string }) => {
      console.log('[MOCK] refreshSession');
      await new Promise((r) => setTimeout(r, 300));

      if (!currentSession) {
        return { data: null, error: new Error('No session to refresh') };
      }

      const newSession: any = {
        user: currentSession.user,
        access_token: `fake-jwt-${Date.now()}`,
        refresh_token: `fake-refresh-${Date.now()}`,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: 'bearer',
      };

      currentSession = {
        user: currentSession.user,
        access_token: newSession.access_token,
        refresh_token: newSession.refresh_token,
        expires_at: newSession.expires_at,
      };

      return {
        data: { session: newSession, user: newSession.user },
        error: null,
      };
    },

    resetPasswordForEmail: async (email: string) => {
      console.log('[MOCK] resetPassword:', email);
      await new Promise((r) => setTimeout(r, 500));
      return { data: {}, error: null };
    },

    updateUser: async (data: any) => {
      console.log('[MOCK] updateUser', data);
      if (currentSession) {
        return {
          data: { user: currentSession.user },
          error: null,
        };
      }
      return { data: null, error: new Error('No user logged in') };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('[MOCK] onAuthStateChange listener registered');
      // Return unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },

  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => {
          console.log('[MOCK] query:', table);
          await new Promise((r) => setTimeout(r, 300));

          if (table === 'users' && currentSession) {
            return {
              data: currentSession.user,
              error: null,
            };
          }

          return { data: null, error: new Error('Not found') };
        },
      }),
    }),

    insert: async (data: any) => {
      console.log('[MOCK] insert into', table, data);
      await new Promise((r) => setTimeout(r, 300));
      return { data: [data], error: null };
    },

    update: async (data: any) => ({
      eq: async () => ({
        select: async () => ({
          single: async () => {
            console.log('[MOCK] update', table, data);
            await new Promise((r) => setTimeout(r, 300));
            return { data, error: null };
          },
        }),
      }),
    }),
  }),

  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => {
        console.log('[MOCK] upload to', bucket, path);
        await new Promise((r) => setTimeout(r, 1000));
        return {
          data: { path: `${bucket}/${path}` },
          error: null,
        };
      },
      getPublicUrl: (path: string) => {
        console.log('[MOCK] getPublicUrl', bucket, path);
        return {
          data: {
            publicUrl: `https://mock-cdn.example.com/${bucket}/${path}`,
          },
        };
      },
    }),
  },
};

export default mockSupabase;
