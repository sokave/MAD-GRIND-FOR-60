import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { categories, type Article } from './news';
import { colors, fonts } from './theme';

export const cardHeight = 120;
export const cardGap = 10;

export const NewsCard = memo(function NewsCard({ article }: { article: Article }) {
  const category = categories[article.category];

  return (
    <Link href={{ pathname: '/[id]', params: { id: article.id } }} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={article.title}
        style={styles.card}
      >
        {article.image ? (
          <Image source={article.image} resizeMode="cover" style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.tile, { backgroundColor: category.background }]}>
            <Ionicons name={category.icon} size={27} color={category.ink} />
          </View>
        )}
        <View style={styles.copy}>
          <View style={styles.meta}>
            <Text numberOfLines={1} style={[styles.category, { color: category.ink }]}>
              {category.label}
            </Text>
            <Text numberOfLines={1} style={styles.date}>{article.date}</Text>
          </View>
          <Text numberOfLines={2} style={styles.title}>{article.title}</Text>
          <Text numberOfLines={1} style={styles.summary}>{article.summary}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={18} color={colors.muted} />
      </Pressable>
    </Link>
  );
});

const styles = StyleSheet.create({
  card: {
    height: cardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: '23%',
    maxWidth: 150,
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.blueLight,
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 15,
  },
  date: {
    flexShrink: 1,
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 15,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  summary: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
