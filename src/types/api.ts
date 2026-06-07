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
