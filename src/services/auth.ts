import supabase from '../supabase/client';
import { User, LoginCredentials, SignUpData, AuthSession } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@venered_session';
const TOKEN_REFRESH_THRESHOLD = 300; // Refresca si faltan 5 min

export class AuthService {
  /**
   * Sign up con email y contraseña
   */
  static async signUp(data: SignUpData): Promise<void> {
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            display_name: data.display_name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Crear perfil en tabla users
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: data.email,
        username: data.username,
        display_name: data.display_name,
        is_private: false,
        is_verified: false,
      });

      if (profileError) throw profileError;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.session) throw new Error('No session returned');

      // Obtener perfil del usuario
      const user = await this.getCurrentUser(data.session.user.id);
      if (!user) throw new Error('User profile not found');

      const session: AuthSession = {
        user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token || '',
        expires_at: data.session.expires_at || 0,
      };

      await this.saveSession(session);
      return session;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cerrar sesión
   */
  static async signOut(): Promise<void> {
    try {
      // Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener usuario actual desde Supabase Auth
   */
  static async getAuthUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  }

  /**
   * Obtener perfil del usuario de la tabla users
   */
  static async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return data as User;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Refrescar token de sesión
   */
  static async refreshSession(
    refreshToken: string
  ): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) throw error;
      if (!data.session) return null;

      // Obtener user actualizado
      const user = await this.getCurrentUser(data.session.user.id);
      if (!user) throw new Error('User profile not found');

      const session: AuthSession = {
        user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token || '',
        expires_at: data.session.expires_at || 0,
      };

      await this.saveSession(session);
      return session;
    } catch (error: any) {
      // En caso de error al refresh, clearear sesión
      await AsyncStorage.removeItem(STORAGE_KEY);
      throw this.handleError(error);
    }
  }

  /**
   * Restaurar sesión desde AsyncStorage
   */
  static async restoreSession(): Promise<AuthSession | null> {
    try {
      const sessionStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (!sessionStr) return null;

      const session: AuthSession = JSON.parse(sessionStr);

      // Verificar si el token está vencido
      const now = Date.now() / 1000;
      const timeToExpiry = session.expires_at - now;

      if (timeToExpiry < TOKEN_REFRESH_THRESHOLD && session.refresh_token) {
        // Refrescar token
        return await this.refreshSession(session.refresh_token);
      }

      return session;
    } catch (error) {
      console.warn('Error restoring session:', error);
      return null;
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Actualizar tabla users
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as User;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Actualizar contraseña
   */
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Solicitar reset de contraseña
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Private helpers

  private static async saveSession(session: AuthSession): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private static handleError(error: any): Error {
    let message = 'Error de autenticación';

    if (error.message) {
      message = error.message;
    }

    if (error.code === 'invalid_credentials') {
      message = 'Email o contraseña incorrectos';
    } else if (error.message?.includes('user_already_exists')) {
      message = 'Este email ya está registrado';
    } else if (error.message?.includes('weak password')) {
      message = 'La contraseña es muy débil';
    }

    return new Error(message);
  }
}

export default AuthService;
