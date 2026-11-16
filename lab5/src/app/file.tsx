import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EntryForm } from '../dialogs';
import { errorText, extension, formatSize, readPath, rootLabel, routePath } from '../files';
import type { Document } from '../files';
import { storage } from '../storage';
import { Button, Icon, IconButton, Notice, Screen, color, font, ui } from '../ui';

const date = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'medium' });
type Snapshot = { key: string; file: Document } | { key: string; error: string };

function FileInfo({ file }: { file: Document }) {
  const suffix = extension(file.name);
  const info = [
    ['Назва', file.name],
    ['Тип', suffix ? `.${suffix}` : 'Без розширення'],
    ['Розмір', formatSize(file.size)],
    ['Змінено', file.modifiedAt === null ? '—' : date.format(file.modifiedAt)],
  ];
  return (
    <View style={[ui.card, styles.panel]}>
      <View style={styles.panelTitle}>
        <Icon name="information-circle-outline" />
        <Text accessibilityRole="header" style={ui.heading}>Відомості</Text>
      </View>
      {info.map(([label, value]) => (
        <View key={label} style={styles.infoRow}>
          <Text style={ui.body}>{label}</Text>
          <Text selectable style={[ui.label, styles.infoValue]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

export default function FileScreen() {
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location?: string }>();
  const path = useMemo(() => readPath(location), [location]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState(false);
  const key = `${revision}:${typeof location === 'string' ? location : ''}`;
  const current = snapshot?.key === key ? snapshot : null;
  const file = current && 'file' in current ? current.file : null;

  useFocusEffect(useCallback(() => {
    if (!path?.length) return;
    let active = true;
    storage.read(path).then((result) => {
      if (active) setSnapshot({ key, file: result });
    }).catch((error: unknown) => {
      if (active) setSnapshot({ key, error: errorText(error, 'Не вдалося відкрити файл. Він міг бути видалений.') });
    });
    return () => { active = false; };
  }, [path, key]));

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/', params: { directory: routePath(path?.slice(0, -1) ?? []) } });
  }

  const name = file?.name ?? path?.at(-1) ?? 'Файл';
  const copy = file?.text;
  const parent = [rootLabel, ...(path?.slice(0, -1) ?? [])].join(' / ');

  return (
    <Screen>
      <ScrollView contentContainerStyle={ui.page}>
        <View style={styles.header}>
          <IconButton icon="arrow-back" label="Назад до файлів" onPress={back} />
          <View style={styles.titleBox}>
            <Text numberOfLines={1} style={ui.caption}>{parent}</Text>
            <Text accessibilityRole="header" style={ui.title}>{name}</Text>
          </View>
        </View>
        {!path?.length ? <Notice>Шлях до файлу некоректний.</Notice> : current && 'error' in current ? <Notice>{current.error}</Notice> : file ? (
          <>
            <View style={[ui.card, styles.panel]}>
              <View style={styles.panelTitle}>
                <Icon name="document-text-outline" />
                <Text accessibilityRole="header" style={ui.heading}>Вміст</Text>
              </View>
              <View style={styles.preview}>
                <Text selectable testID="file-preview" style={copy ? styles.previewText : ui.body}>
                  {copy || (copy === '' ? 'Файл порожній.' : 'Перегляд доступний для файлів .txt.')}
                </Text>
              </View>
              {typeof copy === 'string' && <Button label="Редагувати" icon="create-outline" onPress={() => setEditing(true)} />}
            </View>
            <FileInfo file={file} />
          </>
        ) : <ActivityIndicator color={color.accent} style={styles.spinner} />}
      </ScrollView>
      {editing && path && typeof copy === 'string' && (
        <EntryForm kind="edit" fileName={name} initial={copy} onClose={() => setEditing(false)} submit={async (text) => {
          await storage.saveText(path, copy, text);
          setRevision((value) => value + 1);
        }} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingBottom: 4 },
  titleBox: { flex: 1, minWidth: 0, gap: 3 },
  panel: { padding: 15, gap: 11 },
  panelTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preview: { minHeight: 127, backgroundColor: color.background, borderColor: color.line, borderWidth: 1, borderRadius: 10, padding: 12 },
  previewText: { color: color.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, lineHeight: 23 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderTopColor: color.line, paddingTop: 9 },
  infoValue: { flexShrink: 1, textAlign: 'right', fontFamily: font.medium },
  spinner: { marginVertical: 20 },
});
