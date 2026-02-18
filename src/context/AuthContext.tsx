import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { AuthService } from '../services/auth';
import {
  User,
  LoginCredentials,
  SignUpData,
  AuthSession,
  AuthContextType,
} from '../types';

type AuthState = {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isSignout: boolean;
};

type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: AuthSession | null }
  | { type: 'SIGN_IN'; payload: AuthSession }
  | { type: 'SIGN_UP'; payload: AuthSession }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_ERROR'; payload: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload?.user || null,
        session: action.payload || null,
        isLoading: false,
      };

    case 'SIGN_IN':
    case 'SIGN_UP':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload,
        isSignout: false,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        session: null,
        isSignout: true,
      };

    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    session: null,
    isLoading: true,
    isSignout: false,
  });

  // Restaurar sesión al iniciar app
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const session = await AuthService.restoreSession();
        dispatch({ type: 'RESTORE_TOKEN', payload: session });
      } catch (e) {
        console.warn('Failed to restore session:', e);
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    user: state.user,
    session: state.session,
    isLoading: state.isLoading,
    isSignout: state.isSignout,

    signIn: useCallback(async (credentials: LoginCredentials) => {
      try {
        const session = await AuthService.signIn(credentials);
        dispatch({ type: 'SIGN_IN', payload: session });
      } catch (error: any) {
        throw error;
      }
    }, []),

    signUp: useCallback(async (data: SignUpData) => {
      try {
        await AuthService.signUp(data);
        // Auto login después de signup
        const session = await AuthService.signIn({
          email: data.email,
          password: data.password,
        });
        dispatch({ type: 'SIGN_UP', payload: session });
      } catch (error: any) {
        throw error;
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        await AuthService.signOut();
        dispatch({ type: 'SIGN_OUT' });
      } catch (error: any) {
        throw error;
      }
    }, []),

    restoreToken: useCallback(async () => {
      try {
        const session = await AuthService.restoreSession();
        dispatch({ type: 'RESTORE_TOKEN', payload: session });
      } catch (error: any) {
        console.warn('Error restoring token:', error);
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    }, []),
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
