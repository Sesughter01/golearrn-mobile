import { APP_CONFIG } from '../../constants/config';
import { clearSession, getToken } from '../auth/tokenStorage';
import { ApiEnvelope, ApiValidationErrors } from '../../types/api';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  validationErrors?: ApiValidationErrors;
  isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    validationErrors?: ApiValidationErrors,
    isNetworkError = false,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
    this.isNetworkError = isNetworkError;
  }
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
  } = options;
  const token = requiresAuth ? await getToken() : null;

  if (requiresAuth && !token) {
    throw new ApiError('Missing auth token', 401);
  }

  let response: Response;

  try {
    response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
      undefined,
      true,
    );
  }

  if (response.status === 401 && requiresAuth) {
    await clearSession();
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
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

    throw new ApiError(message, response.status, validationErrors);
  }

  return (await response.json()) as ApiEnvelope<T>;
}
