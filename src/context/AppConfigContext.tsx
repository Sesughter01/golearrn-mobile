import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { APP_CONFIG } from '../constants/config';
import { golearrnApi } from '../services/api/golearrnApi';
import { AppConfigResponse } from '../types/api';

type AppConfigContextValue = {
  config: AppConfigResponse | null;
  error: string | null;
  isLoading: boolean;
  appName: string;
  refresh: () => Promise<void>;
};

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

export function AppConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<AppConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadConfig() {
    setError(null);

    try {
      const nextConfig = await golearrnApi.getAppConfig();
      setConfig(nextConfig);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load app config.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  const value = useMemo<AppConfigContextValue>(
    () => ({
      config,
      error,
      isLoading,
      appName: config?.app_name ?? APP_CONFIG.appName,
      refresh: loadConfig,
    }),
    [config, error, isLoading],
  );

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

export function useAppConfig() {
  const value = useContext(AppConfigContext);

  if (!value) {
    throw new Error('useAppConfig must be used inside AppConfigProvider');
  }

  return value;
}
