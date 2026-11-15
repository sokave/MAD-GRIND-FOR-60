import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAdmin } from '../../../../src/admin';
import { dateLabel, newsStatus } from '../../../../src/data';
import { NewsImage } from '../../../../src/NewsImage';
import { Button, Message, Page, Pill, colors, theme } from '../../../../src/ui';

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { records, deleteNews } = useAdmin();
  const router = useRouter();
  const article = records.news.find((item) => item.id === id);

  function returnToList() {
    if (router.canGoBack()) router.back();
    else router.replace('/news');
  }

  if (!article) {
    return (
      <Page>
        <View style={styles.content}>
          <Message>Новину не знайдено.</Message>
          <Button title="До списку новин" onPress={() => router.replace('/news')} />
        </View>
      </Page>
    );
  }

  const { title, category, status, imageUrl, body, createdAt } = article;

  function remove() {
    function confirmed() {
      deleteNews(id);
      returnToList();
    }

    const prompt = 'Видалити новину «' + title + '»?';
    if (Platform.OS === 'web') {
      if (window.confirm(prompt)) confirmed();
      return;
    }

    Alert.alert('Видалити новину?', '«' + title + '» буде видалено зі списку.', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: confirmed },
    ]);
  }

  return (
    <Page>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[theme.card, styles.article]}>
          <NewsImage url={imageUrl} style={styles.image} />
          <View style={styles.copy}>
            <View style={styles.metadata}>
              <Text style={theme.small}>{category} · {dateLabel.format(new Date(createdAt))}</Text>
              <Pill label={newsStatus[status]} tone={status === 'published' ? 'green' : status === 'review' ? 'gold' : 'gray'} />
            </View>
            <Text accessibilityRole="header" style={theme.title}>{title}</Text>
            <Text selectable style={styles.body}>{body}</Text>
            <Text
              accessibilityRole="link"
              accessibilityLabel="Відкрити посилання на зображення"
              selectable
              onPress={() => { void Linking.openURL(imageUrl).catch(() => {}); }}
              style={styles.url}
            >{imageUrl}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button title="Видалити" icon="trash-outline" variant="danger" onPress={remove} />
          <Button
            title="Редагувати"
            icon="create-outline"
            onPress={() => router.push({ pathname: '/news-editor', params: { id } })}
          />
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 880, alignSelf: 'center', padding: 20, gap: 14, paddingBottom: 28 },
  article: { overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 2.2, maxHeight: 330 },
  metadata: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  copy: { padding: 19, gap: 10 },
  body: { ...theme.body, color: colors.ink, fontSize: 15, lineHeight: 24 },
  url: { ...theme.small, color: colors.green, textDecorationLine: 'underline' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
});
