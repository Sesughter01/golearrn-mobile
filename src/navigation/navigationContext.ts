import { createContext, useContext } from 'react';

import { AppNavigatorValue } from '../types/navigation';

export const NavigationContext = createContext<AppNavigatorValue | null>(null);

export function useAppNavigation() {
  const value = useContext(NavigationContext);

  if (!value) {
    throw new Error('useAppNavigation must be used inside AppNavigator');
  }

  return value;
}
