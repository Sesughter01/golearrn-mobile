import { StatusBar } from 'expo-status-bar';

import { AppConfigProvider } from './context/AppConfigContext';
import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { getInitialRoute } from './navigation/routes';

export function AppRoot() {
  return (
    <AppConfigProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AppNavigator initialRoute={getInitialRoute()} />
      </AuthProvider>
    </AppConfigProvider>
  );
}
