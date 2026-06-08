import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { CourseSummary } from '../types/course';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { Badge, getTranslationTone } from './Badge';
import { PriceLabel } from './PriceLabel';

const coursePlaceholder = require('../../assets/placeholders/course-placeholder.png');

export function CourseCard({
  course,
  onPress,
}: {
  course: CourseSummary;
  onPress: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showRemoteImage = Boolean(course.thumbnailUrl) && !imageFailed;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.thumbWrap}>
        <Image
          source={showRemoteImage ? { uri: course.thumbnailUrl ?? '' } : coursePlaceholder}
          onError={() => setImageFailed(true)}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{course.title}</Text>
          {course.enrolled ? <Badge label="Enrolled" tone="green" /> : null}
        </View>
        <Text style={styles.meta}>{course.instructor}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>
        <View style={styles.detailRow}>
          {course.category ? <Text style={styles.detail}>{course.category}</Text> : null}
          <Text style={styles.detail}>{course.lessonsCount} lessons</Text>
          <Text style={styles.detail}>{course.language}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.badges}>
            <Badge
              label={`Translation: ${course.translationState}`}
              tone={getTranslationTone(course.translationState)}
            />
            {course.ratingAverage ? (
              <Badge label={`Rating ${course.ratingAverage.toFixed(1)}`} tone="amber" />
            ) : null}
          </View>
          <PriceLabel label={course.priceLabel ?? 'Enroll via Web'} isFree={course.isFree} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  pressed: {
    opacity: 0.92,
  },
  thumbWrap: {
    backgroundColor: COLORS.navySoft,
    minHeight: 180,
  },
  thumbnail: {
    height: 180,
    width: '100%',
  },
  content: {
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.primaryText,
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  meta: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  detail: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  badges: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
});
