function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => {
        const normalizedKey = key.toLowerCase();

        if (
          normalizedKey.includes('token') ||
          normalizedKey.includes('password') ||
          normalizedKey.includes('authorization')
        ) {
          return [key, '[REDACTED]'];
        }

        return [key, sanitizeValue(entryValue)];
      }),
    );
  }

  return value;
}

export function devLog(label: string, payload?: unknown) {
  if (!__DEV__) {
    return;
  }

  if (payload === undefined) {
    console.info(`[GOLEARRN DEV] ${label}`);
    return;
  }

  console.info(`[GOLEARRN DEV] ${label}`, sanitizeValue(payload));
}
