import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ListRenderItem } from 'react-native';
import { useAdmin } from '../../../../src/admin';
import { dateLabel, newsStatus, type News, type NewsStatus } from '../../../../src/data';
import { NewsImage } from '../../../../src/NewsImage';
import { RecordList } from '../../../../src/RecordList';
import { Button, Icon, Page, PageIntro, Pill, colors, theme, type Tone } from '../../../../src/ui';

const newsRowHeight = 100;
const tones: Record<NewsStatus, Tone> = { published: 'green', draft: 'gray', review: 'gold' };

const NewsRow = memo(function NewsRow({ item, open }: { item: News; open: (id: string) => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'Відкрити новину: ' + item.title}
      onPress={() => open(item.id)}
      style={({ pressed }) => [theme.card, styles.row, pressed && theme.pressed]}
    >
      <NewsImage url={item.imageUrl} style={styles.image} />
      <View style={styles.copy}>
        <Text numberOfLines={2} style={theme.strong}>{item.title}</Text>
        <View style={styles.meta}>
          <Text numberOfLines={1} style={styles.category}>{item.category}</Text>
          <Text numberOfLines={1} style={theme.small}>{dateLabel.format(new Date(item.createdAt))}</Text>
        </View>
        <Pill label={newsStatus[item.status]} tone={tones[item.status]} />
      </View>
      <Icon name="chevron-forward-outline" size={17} color={colors.muted} />
    </Pressable>
  );
});

export default function NewsListScreen() {
  const { records, newsFilters } = useAdmin();
  const { category, status } = newsFilters;
  const router = useRouter();
  const items = useMemo(() => records.news.filter((item) => (
    (category === null || item.category === category) && (status === null || item.status === status)
  )), [category, records.news, status]);

  const open = useCallback((id: string) => {
    router.push({ pathname: '/news/[id]', params: { id } });
  }, [router]);
  const render = useCallback<ListRenderItem<News>>(({ item }) => <NewsRow item={item} open={open} />, [open]);

  return (
    <Page>
      <PageIntro
        title="Новини"
        description={'Показано ' + items.length + ' із ' + records.news.length}
        actions={
          <>
            <Button title="Фільтри" label="Фільтри новин" icon="options-outline" variant="secondary" onPress={() => router.push('/news-filters')} />
            <Button title="Нова новина" icon="add" onPress={() => router.push('/news-editor')} />
          </>
        }
      >
        {(category || status) && (
          <View style={styles.filters}>
            {category && <Pill label={category} tone="green" />}
            {status && <Pill label={newsStatus[status]} tone={tones[status]} />}
          </View>
        )}
      </PageIntro>
      <RecordList name="news-list" data={items} rowHeight={newsRowHeight} renderItem={render} empty="Новин за цими фільтрами немає." />
    </Page>
  );
}

const styles = StyleSheet.create({
  row: { height: newsRowHeight, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 9 },
  image: { width: 70, height: 70, borderRadius: 9, flexShrink: 0 },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  category: { ...theme.small, color: colors.green, flexShrink: 1 },
  filters: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
});
