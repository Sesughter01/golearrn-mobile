import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ApiError } from '../services/api/client';
import { golearrnApi, LoginPayload, RegisterPayload } from '../services/api/golearrnApi';
import { clearSession, getToken, saveToken } from '../services/auth/tokenStorage';
import { AuthUser } from '../types/api';
import { devLog } from '../utils/devLogger';
import { LearnerSessionStatus } from '../types/navigation';

type AuthContextValue = {
  status: LearnerSessionStatus;
  user: AuthUser | null;
  error: string | null;
  errorKind: 'email_taken' | 'invalid_credentials' | null;
  isSubmitting: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function formatAuthError(error: unknown): {
  message: string;
  kind: 'email_taken' | 'invalid_credentials' | null;
} {
  if (error instanceof ApiError) {
    if (error.isTimeout) {
      return {
        message: 'GOLEARRN took too long to respond. Please try again in a moment.',
        kind: null,
      };
    }

    if (error.isNetworkError) {
      return {
        message: 'We could not reach GOLEARRN. Check your connection and try again.',
        kind: null,
      };
    }

    const firstValidationGroup = error.validationErrors
      ? Object.values(error.validationErrors)[0]
      : null;
    const firstValidationMessage = firstValidationGroup?.[0];
    const emailMessages = error.validationErrors?.email;
    const emailTaken = emailMessages?.some((message) =>
      message.toLowerCase().includes('already been taken'),
    );

    if (emailTaken) {
      return {
        message: 'This email already has a GOLEARRN account. Please log in instead.',
        kind: 'email_taken',
      };
    }

    const normalizedMessage = (firstValidationMessage ?? error.message).toLowerCase();
    const invalidCredentials =
      error.status === 401 ||
      normalizedMessage.includes('invalid credentials') ||
      normalizedMessage.includes('incorrect') ||
      normalizedMessage.includes('sign you in');

    if (invalidCredentials) {
      return {
        message: "We couldn't sign you in with that email and password.",
        kind: 'invalid_credentials',
      };
    }

    return {
      message: firstValidationMessage ?? error.message,
      kind: null,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
    kind: null,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<LearnerSessionStatus>('bootstrapping');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<'email_taken' | 'invalid_credentials' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const token = await getToken();

        if (!token) {
          setStatus('guest');
          return;
        }

        const currentUser = await golearrnApi.getMe();
        setUser(currentUser);
        setStatus('authenticated');
      } catch (error) {
        devLog('Auth bootstrap fell back to guest flow', {
          error,
        });
        await clearSession();
        setUser(null);
        setStatus('guest');
      }
    }

    bootstrapAuth();
  }, []);

  async function login(payload: LoginPayload) {
    setIsSubmitting(true);
    setError(null);
    setErrorKind(null);

    try {
      const response = await golearrnApi.login(payload);
      await saveToken(response.token);
      setUser(response.user);
      setStatus('authenticated');
      return true;
    } catch (nextError) {
      devLog('Login failed', { error: nextError });
      const formatted = formatAuthError(nextError);
      setError(formatted.message);
      setErrorKind(formatted.kind);
      setUser(null);
      setStatus('guest');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setIsSubmitting(true);
    setError(null);
    setErrorKind(null);

    try {
      const response = await golearrnApi.register(payload);
      await saveToken(response.token);
      setUser(response.user);
      setStatus('authenticated');
      return true;
    } catch (nextError) {
      devLog('Registration failed', { error: nextError });
      const formatted = formatAuthError(nextError);
      setError(formatted.message);
      setErrorKind(formatted.kind);
      setUser(null);
      setStatus('guest');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setIsSubmitting(true);
    setError(null);
    setErrorKind(null);

    try {
      if (status === 'authenticated') {
        await golearrnApi.logout();
      }
    } catch (nextError) {
      devLog('Logout API call failed before local clear', { error: nextError });
      setError(nextError instanceof Error ? nextError.message : 'Unable to log out cleanly.');
    } finally {
      await clearSession();
      setUser(null);
      setStatus('guest');
      setIsSubmitting(false);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      errorKind,
      isSubmitting,
      login,
      register,
      logout,
      clearError: () => {
        setError(null);
        setErrorKind(null);
      },
    }),
    [error, errorKind, isSubmitting, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
