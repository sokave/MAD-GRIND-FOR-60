import { useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsCard, cardGap, cardHeight } from '../../../src/NewsCard';
import { articles, pageSize } from '../../../src/news';
import { colors, fonts, pageWidth, shared } from '../../../src/theme';

/** @typedef {import('../../../src/news').Article} Article */

/** @param {Article} article */
const keyExtractor = (article) => article.id;
const endReachedThreshold = 0.45;
const scrollStyle = Platform.select({
  // Keep the current scroll offset when VirtualizedList replaces a spacer after appending a page.
  web: /** @type {import('react-native').ViewStyle & { overflowAnchor: 'none' }} */ ({
    overflowAnchor: 'none',
  }),
});
/** @type {import('react-native').ListRenderItem<Article>} */
const renderArticle = ({ item }) => <NewsCard article={item} />;
/** @type {NonNullable<import('react-native').FlatListProps<Article>['getItemLayout']>} */
const getItemLayout = (_, index) => ({
  length: cardHeight,
  offset: (cardHeight + cardGap) * index,
  index,
});

function Separator() {
  return <View style={styles.separator} />;
}

export default function NewsScreen() {
  const [count, setCount] = useState(pageSize);
  const [operation, setOperation] = useState(/** @type {'load' | 'refresh' | null} */ (null));
  const [refreshMessage, setRefreshMessage] = useState('');
  const list = useRef(/** @type {FlatList<Article> | null} */ (null));
  const pending = useRef(/** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined));
  const visibleArticles = useMemo(() => articles.slice(0, count), [count]);
  const refreshing = operation === 'refresh';

  useEffect(() => () => clearTimeout(pending.current), []);

  function loadMore() {
    if (pending.current !== undefined || count >= articles.length) return;

    setOperation('load');
    pending.current = setTimeout(() => {
      setCount((previous) => Math.min(previous + pageSize, articles.length));
      setOperation(null);
      pending.current = undefined;
    }, 350);
  }

  function refresh() {
    if (refreshing) return;

    clearTimeout(pending.current);
    setOperation('refresh');
    setRefreshMessage('');
    pending.current = setTimeout(() => {
      list.current?.scrollToOffset({ offset: 0, animated: false });
      setCount(pageSize);
      setOperation(null);
      setRefreshMessage('Стрічку оновлено');
      pending.current = undefined;
    }, 450);
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={shared.safeArea}>
      <View style={styles.page}>
        <View style={styles.intro}>
          <View style={styles.headingRow}>
            <Text accessibilityRole="header" style={[shared.pageHeading, styles.heading]}>
              Стрічка новин
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Оновити стрічку"
              accessibilityState={{ disabled: refreshing }}
              disabled={refreshing}
              onPress={refresh}
              style={({ pressed }) => [styles.refreshButton, pressed && shared.pressed]}
            >
              {refreshing
                ? <ActivityIndicator color={colors.blue} size="small" />
                : <Ionicons name="refresh-outline" color={colors.blue} size={20} />}
            </Pressable>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.count}>{count} із {articles.length} новин</Text>
            {!!refreshMessage && (
              <Text accessibilityLiveRegion="polite" style={styles.status}>
                {refreshMessage}
              </Text>
            )}
          </View>
        </View>
        <FlatList
          ref={list}
          testID="news-feed"
          style={scrollStyle}
          data={visibleArticles}
          keyExtractor={keyExtractor}
          renderItem={renderArticle}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={endReachedThreshold}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          ListFooterComponent={
            <View style={styles.footer}>
              {operation === 'load' && <ActivityIndicator size="small" color={colors.blue} />}
              <Text accessibilityLiveRegion="polite" style={styles.status}>
                {count === articles.length ? 'Усі новини завантажено' : 'Прокрути вниз, щоб завантажити більше'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: pageWidth,
  },
  intro: {
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 14,
    gap: 8,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heading: { flex: 1 },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  count: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.blueLight,
    color: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 17,
  },
  status: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  separator: { height: cardGap },
  footer: {
    minHeight: 56,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
