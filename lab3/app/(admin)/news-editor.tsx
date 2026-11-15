import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAdmin } from '../../src/admin';
import { categories, newsStatus, type NewsInput, type NewsStatus } from '../../src/data';
import { ModalFrame } from '../../src/ModalFrame';
import { Button, Choices, Field, IconButton, Message, colors, theme } from '../../src/ui';

const empty: NewsInput = { title: '', category: 'Університет', status: 'draft', imageUrl: '', body: '' };
const categoryOptions = categories.map((category) => ({ value: category, label: category }));
const statusOptions = (Object.keys(newsStatus) as NewsStatus[])
  .map((status) => ({ value: status, label: newsStatus[status] }));

function isImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export default function NewsEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { records, saveNews } = useAdmin();
  const router = useRouter();
  const original = id ? records.news.find((item) => item.id === id) : undefined;
  const [draft, setDraft] = useState<NewsInput>(() => original ? {
    title: original.title, category: original.category, status: original.status,
    imageUrl: original.imageUrl, body: original.body,
  } : empty);
  const [error, setError] = useState('');
  const submitted = useRef(false);
  const title = id ? 'Редагування новини' : 'Нова новина';
  const missing = !!id && !original;

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/news');
  }

  function change<K extends keyof NewsInput>(field: K, value: NewsInput[K]) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setError('');
  }

  function submit() {
    if (submitted.current) return;
    const input = {
      ...draft, title: draft.title.trim(), imageUrl: draft.imageUrl.trim(), body: draft.body.trim(),
    };
    if (!input.title || !input.body || !input.imageUrl) {
      setError('Заповніть заголовок, посилання на зображення й текст новини.');
      return;
    }
    if (!isImageUrl(input.imageUrl)) {
      setError('Введіть повну HTTPS-адресу зображення.');
      return;
    }
    submitted.current = true;
    saveNews(input, id);
    close();
  }

  return (
    <ModalFrame title={title} onClose={close}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text accessibilityRole="header" style={theme.subhead}>{title}</Text>
          <IconButton label="Закрити редактор" icon="close-outline" onPress={close} />
        </View>
        {missing ? (
          <Message>Цю новину вже видалено або вона недоступна.</Message>
        ) : (
          <>
            <Field label="Заголовок" maxLength={120} value={draft.title} onChangeText={(value) => change('title', value)} placeholder="Назва матеріалу" />
            <Choices label="Категорія" options={categoryOptions} value={draft.category} onChange={(value) => change('category', value)} />
            <Choices label="Статус" options={statusOptions} value={draft.status} onChange={(value) => change('status', value)} />
            <Field
              label="Посилання на зображення (URL)"
              value={draft.imageUrl}
              onChangeText={(value) => change('imageUrl', value)}
              placeholder="https://example.com/photo.jpg"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              maxLength={2000}
            />
            <Field
              label="Текст новини"
              value={draft.body}
              onChangeText={(value) => change('body', value)}
              placeholder="Введіть текст матеріалу"
              multiline
              maxLength={8000}
              style={styles.body}
            />
            {!!error && <Message>{error}</Message>}
            <View style={styles.actions}>
              <Button title="Скасувати" onPress={close} variant="secondary" />
              <Button title="Зберегти" icon="checkmark-outline" onPress={submit} />
            </View>
          </>
        )}
      </ScrollView>
    </ModalFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, flexShrink: 1, minHeight: 0, backgroundColor: colors.surface },
  content: { padding: 20, gap: 15, width: '100%', maxWidth: 720, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  body: { minHeight: 106, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
});
