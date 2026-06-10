export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiValidationErrors = Record<string, string[]>;

export type AppConfigResponse = {
  app_name?: string;
  feature_flags?: Record<string, boolean>;
  privacy_policy_url?: string;
  terms_url?: string;
  support_url?: string;
  support_email?: string;
  otp_enabled?: boolean;
};

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  avatar_url?: string | null;
  language_preference?: {
    locale?: string | null;
    source?: string | null;
  } | null;
  role?: {
    value?: string | null;
    label?: string | null;
  } | null;
};

export type AuthTokenPayload = {
  token: string;
  user: AuthUser;
};

export type QrResolveResponse = {
  code?: string;
  destination?: string;
  token?: string;
  status?: string;
};

export type MobileSearchMeta = {
  status?: string;
  fallback_mode?: boolean;
  match_references?: Record<
    string,
    {
      label?: string;
      snippet?: string;
      source_type?: string;
      score?: number;
    }
  >;
};
