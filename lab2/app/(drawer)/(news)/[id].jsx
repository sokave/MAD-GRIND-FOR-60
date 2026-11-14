import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { articles, categories } from '../../../src/news';
import { colors, fonts, pageWidth, shared } from '../../../src/theme';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const article = articles.find((item) => item.id === id);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={shared.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        {article ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={goBack}
              style={({ pressed }) => [styles.back, pressed && shared.pressed]}
            >
              <Ionicons name="arrow-back-outline" size={18} color={colors.blue} />
              <Text style={styles.backLabel}>До новин</Text>
            </Pressable>
            <View style={styles.article}>
              {article.image && (
                <View style={styles.cover}>
                  <Image source={article.image} resizeMode="cover" style={styles.coverImage} />
                </View>
              )}
              <View style={styles.copy}>
                <View style={styles.meta}>
                  <Text style={[shared.eyebrow, { color: categories[article.category].ink }]}>
                    {categories[article.category].label.toUpperCase()}
                  </Text>
                  <Text style={styles.date}>{article.date}</Text>
                </View>
                <Text accessibilityRole="header" style={styles.title}>{article.title}</Text>
                <Text style={styles.summary}>{article.summary}</Text>
                <View style={styles.paragraphs}>
                  {article.paragraphs.map((paragraph) => (
                    <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={[styles.article, styles.empty]}>
            <Ionicons name="newspaper-outline" size={30} color={colors.blue} />
            <Text accessibilityRole="header" style={shared.pageHeading}>Новину не знайдено</Text>
            <Text style={shared.body}>Можливо, посилання застаріло або містить помилку.</Text>
            <Link href="/" replace style={styles.backLabel}>Повернутися до стрічки</Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: pageWidth,
    alignSelf: 'center',
    padding: 18,
    paddingBottom: 30,
    gap: 12,
  },
  back: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  backLabel: {
    color: colors.blue,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
  },
  article: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    aspectRatio: 2,
    maxHeight: 300,
    backgroundColor: colors.blueLight,
  },
  coverImage: { width: '100%', height: '100%' },
  copy: {
    padding: 22,
    gap: 13,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  date: {
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  title: {
    color: colors.navy,
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.7,
  },
  summary: {
    color: colors.muted,
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 22,
  },
  paragraphs: {
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 14,
  },
  paragraph: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  empty: {
    padding: 22,
    gap: 12,
  },
});
