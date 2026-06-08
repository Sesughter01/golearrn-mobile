import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { LogoMark } from '../components/LogoMark';
import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

const splashArt = require('../../assets/app/splash.png');

export function SplashScreen() {
  const navigation = useAppNavigation();
  const { appName } = useAppConfig();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'bootstrapping') {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigation.reset({ name: status === 'authenticated' ? 'dashboard' : 'welcome' });
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [navigation, status]);

  return (
    <View style={styles.container}>
      <Image source={splashArt} style={styles.splashImage} resizeMode="contain" />
      <LogoMark variant="dark" size="md" />
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.subtitle}>
        {status === 'bootstrapping' ? 'Restoring your learner session.' : 'Learn. Upskill. Grow.'}
      </Text>
      <ActivityIndicator color={COLORS.primaryCyan} size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.darkNavy,
    flex: 1,
    gap: SPACING.md,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  splashImage: {
    height: 144,
    width: 144,
  },
  appName: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: COLORS.onDarkMuted,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    textAlign: 'center',
  },
});
