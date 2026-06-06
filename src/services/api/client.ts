import { APP_CONFIG } from '../../constants/config';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
