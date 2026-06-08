import { ReactNode, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
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
import { AppNavigatorValue, RootRoute } from '../types/navigation';
import { NavigationContext } from './navigationContext';

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
                    ? 'Learner session active'
                    : status === 'bootstrapping'
                      ? 'Restoring learner session'
                      : 'Guest flow'}
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
        {showPrimaryNav(currentRoute.name) ? (
          <View style={styles.bottomBar}>
            <NavItem
              label="Home"
              active={currentRoute.name === 'dashboard'}
              onPress={() => value.reset({ name: 'dashboard' })}
            />
            <NavItem
              label="Courses"
              active={currentRoute.name === 'catalog' || currentRoute.name === 'course-details'}
              onPress={() => value.reset({ name: 'catalog' })}
            />
            <NavItem
              label="Profile"
              active={currentRoute.name === 'profile'}
              onPress={() => value.reset({ name: 'profile' })}
            />
          </View>
        ) : null}
      </View>
    </NavigationContext.Provider>
  );
}

function showPrimaryNav(routeName: RootRoute['name']) {
  return (
    routeName === 'dashboard' ||
    routeName === 'catalog' ||
    routeName === 'course-details' ||
    routeName === 'profile'
  );
}

function NavItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
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
    backgroundColor: COLORS.lightBackground,
    flex: 1,
  },
  topBar: {
    backgroundColor: COLORS.cardBackground,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  topBarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  topBarTitle: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  topBarMeta: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  backButton: {
    backgroundColor: COLORS.navySoft,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.primaryBlue,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  screen: {
    flex: 1,
  },
  bottomBar: {
    backgroundColor: COLORS.cardBackground,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    ...SHADOWS.soft,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  navItemActive: {
    backgroundColor: COLORS.navySoft,
  },
  navLabel: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  navLabelActive: {
    color: COLORS.primaryBlue,
  },
});
