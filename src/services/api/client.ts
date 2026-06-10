import { APP_CONFIG } from '../../constants/config';
import { clearSession, getToken } from '../auth/tokenStorage';
import { ApiEnvelope, ApiValidationErrors } from '../../types/api';
import { devLog } from '../../utils/devLogger';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  validationErrors?: ApiValidationErrors;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(
    message: string,
    status: number,
    validationErrors?: ApiValidationErrors,
    isNetworkError = false,
    isTimeout = false,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

function getDefaultErrorMessage(status: number) {
  if (status >= 500) {
    return 'The GOLEARRN server is having trouble right now. Please try again shortly.';
  }

  if (status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (status === 404) {
    return 'We could not find that resource. Please go back and try again.';
  }

  if (status === 403) {
    return 'You do not currently have access to this action.';
  }

  if (status === 401) {
    return 'Your session is no longer valid. Please sign in again.';
  }

  return `API request failed with status ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = false,
    timeoutMs = APP_CONFIG.requestTimeoutMs,
  } = options;
  const token = requiresAuth ? await getToken() : null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (requiresAuth && !token) {
    throw new ApiError('Missing auth token', 401);
  }

  let response: Response;

  try {
    response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      devLog('API timeout', { method, path });
      throw new ApiError(
        'The request took too long. Please check your connection and try again.',
        408,
        undefined,
        false,
        true,
      );
    }

    devLog('API network failure', { method, path, error });
    throw new ApiError(
      'We could not reach GOLEARRN right now. Check your internet connection and try again.',
      0,
      undefined,
      true,
    );
  }

  clearTimeout(timeoutId);

  if (response.status === 401 && requiresAuth) {
    await clearSession();
  }

  if (!response.ok) {
    let message = getDefaultErrorMessage(response.status);
    let validationErrors: ApiValidationErrors | undefined;

    try {
      const errorPayload = (await response.json()) as {
        message?: string;
        errors?: ApiValidationErrors;
      };
      if (errorPayload.message) {
        message = errorPayload.message;
      }
      validationErrors = errorPayload.errors;
    } catch {
      // Leave the default message when the API does not return JSON.
    }

    devLog('API request failed', {
      method,
      path,
      status: response.status,
      message,
      validationErrors,
    });
    throw new ApiError(message, response.status, validationErrors);
  }

  return (await response.json()) as ApiEnvelope<T>;
}
