import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './navigation/AppNavigator';
import { getInitialRoute } from './navigation/routes';

export function AppRoot() {
  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator initialRoute={getInitialRoute()} />
    </>
  );
}
