/*
 * Mock Supabase Client para desarrollo y testing
 * Simula respuestas sin conexion real
 */

import { User, AuthSession, LoginCredentials } from '../types';

const nowIso = () => new Date().toISOString();

// Mock users database
const mockUsers: Record<string, User> = {
  'user-0123': {
    id: 'user-0123',
    email: 'demo@example.com',
    username: 'demousuario',
    display_name: 'Usuario Demo',
    bio: 'Esta es mi bio de demostracion',
    is_private: false,
    is_verified: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
};

// Simulated session storage
let currentSession: AuthSession | null = null;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

const buildSession = (user: User): AuthSession => ({
  user,
  access_token: `mock_access_${Date.now()}`,
  refresh_token: `mock_refresh_${Date.now()}`,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
});

// Minimal query builder for users table
const usersQuery = () => {
  let userId: string | null = null;
  let updatePayload: Partial<User> | null = null;

  return {
    select: () => ({
      eq: (_field: string, value: string) => {
        userId = value;
        return {
          single: async () => {
            await sleep(100);
            const user = mockUsers[userId || ''] || null;
            if (!user) {
              return { data: null, error: { code: 'PGRST116' } };
            }
            return { data: user, error: null };
          },
        };
      },
    }),
    insert: async (data: Partial<User>) => {
      await sleep(100);
      const id = data.id || `user-${Date.now()}`;
      mockUsers[id] = {
        id,
        email: data.email || 'demo@example.com',
        username: data.username || 'usuario',
        display_name: data.display_name || 'Usuario',
        bio: data.bio,
        avatar_url: data.avatar_url,
        website: data.website,
        is_private: data.is_private ?? false,
        is_verified: data.is_verified ?? false,
        created_at: nowIso(),
        updated_at: nowIso(),
      } as User;
      return { data: mockUsers[id], error: null };
    },
    update: (payload: Partial<User>) => {
      updatePayload = payload;
      return {
        eq: (_field: string, value: string) => {
          userId = value;
          return {
            select: () => ({
              single: async () => {
                await sleep(100);
                if (!userId || !mockUsers[userId]) {
                  return { data: null, error: { code: 'PGRST116' } };
                }
                mockUsers[userId] = {
                  ...mockUsers[userId],
                  ...updatePayload,
                  updated_at: nowIso(),
                } as User;
                return { data: mockUsers[userId], error: null };
              },
            }),
          };
        },
      };
    },
  };
};

export const mockSupabase = {
  auth: {
    signUp: async (data: { email: string; password: string; options?: any }) => {
      await sleep(200);
      if (!data.email || !data.password) {
        return { data: null, error: new Error('Email and password required') };
      }
      if (data.password.length < 6) {
        return {
          data: null,
          error: new Error('Password must be at least 6 characters'),
        };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        username: data.options?.data?.username || 'nuevo',
        display_name: data.options?.data?.display_name || 'Nuevo Usuario',
        is_private: false,
        is_verified: false,
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      mockUsers[newUser.id] = newUser;
      return {
        data: { user: { id: newUser.id } },
        error: null,
      };
    },

    signInWithPassword: async (credentials: LoginCredentials) => {
      await sleep(200);
      const user = Object.values(mockUsers).find(
        (u) => u.email === credentials.email
      );
      if (!user) {
        return { data: null, error: new Error('invalid_credentials') };
      }

      const session = buildSession(user);
      currentSession = session;
      return { data: { session }, error: null };
    },

    signOut: async () => {
      await sleep(100);
      currentSession = null;
      return { error: null };
    },

    getUser: async () => {
      await sleep(50);
      return {
        data: { user: currentSession?.user || null },
        error: null,
      };
    },

    refreshSession: async (_data: { refresh_token: string }) => {
      await sleep(150);
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const session = buildSession(currentSession.user);
      currentSession = session;
      return { data: { session }, error: null };
    },

    updateUser: async (_data: { password: string }) => {
      await sleep(100);
      return { error: null };
    },

    resetPasswordForEmail: async (_email: string) => {
      await sleep(100);
      return { error: null };
    },
  },

  from: (table: string) => {
    if (table === 'users') return usersQuery();
    return {
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({
        eq: () => ({
          select: () => ({ single: async () => ({ data: null, error: null }) }),
        }),
      }),
    };
  },
};

export default mockSupabase;
