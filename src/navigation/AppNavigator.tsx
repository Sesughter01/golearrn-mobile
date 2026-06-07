import { ReactNode, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';
import { AppNavigatorValue, RootRoute } from '../types/navigation';
import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
import { NavigationContext } from './navigationContext';

import { CourseCatalogScreen } from '../screens/CourseCatalogScreen';
import { CourseDetailsScreen } from '../screens/CourseDetailsScreen';
import { CoursePlayerScreen } from '../screens/CoursePlayerScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

type AppNavigatorProps = {
  initialRoute: RootRoute;
};

export function AppNavigator({ initialRoute }: AppNavigatorProps) {
  const [routes, setRoutes] = useState<RootRoute[]>([initialRoute]);
  const { appName } = useAppConfig();
  const { status } = useAuth();

  const currentRoute = routes[routes.length - 1];

  const value = useMemo<AppNavigatorValue>(
    () => ({
      currentRoute,
      canGoBack: routes.length > 1,
      goBack: () => {
        setRoutes((current) => (current.length > 1 ? current.slice(0, -1) : current));
      },
      navigate: (route) => {
        setRoutes((current) => [...current, route]);
      },
      reset: (route) => {
        setRoutes([route]);
      },
    }),
    [currentRoute, routes.length],
  );

  return (
    <NavigationContext.Provider value={value}>
      <View style={styles.appShell}>
        {currentRoute.name !== 'splash' ? (
          <View style={styles.topBar}>
            <View style={styles.topBarRow}>
              <View>
                <Text style={styles.topBarTitle}>{appName}</Text>
                <Text style={styles.topBarMeta}>
                  {status === 'authenticated'
                    ? 'Authenticated learner session'
                    : status === 'bootstrapping'
                      ? 'Restoring your session'
                      : 'Guest session'}
                </Text>
              </View>
              {routes.length > 1 ? (
                <Pressable onPress={value.goBack} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}
        <View style={styles.screen}>{renderRoute(currentRoute)}</View>
      </View>
    </NavigationContext.Provider>
  );
}

function renderRoute(route: RootRoute): ReactNode {
  switch (route.name) {
    case 'splash':
      return <SplashScreen />;
    case 'welcome':
      return <WelcomeScreen />;
    case 'login':
      return <LoginScreen />;
    case 'forgot-password':
      return <ForgotPasswordScreen />;
    case 'register':
      return <RegisterScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'catalog':
      return <CourseCatalogScreen />;
    case 'course-details':
      return <CourseDetailsScreen courseId={route.params.courseId} />;
    case 'course-player':
      return (
        <CoursePlayerScreen
          courseId={route.params.courseId}
          lessonId={route.params.lessonId}
        />
      );
    case 'profile':
      return <ProfileSettingsScreen />;
  }
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  topBarTitle: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
  },
  topBarMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  backButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  backButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  screen: {
    flex: 1,
  },
});
