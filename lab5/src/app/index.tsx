import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dialog, EntryForm, dialogActions } from '../dialogs';
import { errorText, extension, formatSize, readPath, rootLabel, routePath } from '../files';
import type { Capacity, Entry, Kind, Path } from '../files';
import { storage } from '../storage';
import { Button, Icon, IconButton, Notice, Screen, color, font, ui } from '../ui';

type Listing = { key: string; entries: Entry[]; error?: string };
const countRule = {
  select(count: number) {
    const last = count % 10;
    const lastTwo = count % 100;

    if (lastTwo >= 11 && lastTwo <= 14) return 'other';
    if (last === 1) return 'one';
    if (last >= 2 && last <= 4) return 'few';
    return 'other';
  },
};
const countLabels = { one: 'елемент', few: 'елементи', other: 'елементів' };

function StorageCard({ stats }: { stats: Capacity | null }) {
  const percent = stats ? stats.used / stats.total * 100 : 0;
  const usage = percent > 0 && percent < 0.1 ? '<0,1' : percent.toLocaleString('uk', { maximumFractionDigits: 1 });
  const metrics = [
    ['Загалом', stats?.total],
    ['Вільно', stats?.free],
    ['Зайнято', stats?.used],
  ] as const;
  return (
    <View style={styles.storage}>
      <View style={styles.storageHead}>
        <Icon name="server-outline" tint={color.onAccent} />
        <Text accessibilityRole="header" style={styles.storageTitle}>
          {Platform.OS === 'web' ? 'Сховище браузера' : 'Сховище пристрою'}
        </Text>
        {stats && <Text style={styles.storageStatus}>{usage}% зайнято</Text>}
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View>
      <View style={styles.metrics}>
        {metrics.map(([label, value], index) => (
          <View key={label} style={[styles.metric, index > 0 && styles.metricBorder]}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.metricValue} testID={`storage-${index}`}>{formatSize(value ?? null)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Breadcrumbs({ path, open }: { path: Path; open: (path: Path) => void }) {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  return (
    <View style={styles.breadcrumbRow}>
      {path.length > 0 && <IconButton icon="arrow-up" label="На рівень вище" onPress={() => open(path.slice(0, -1))} />}
      <ScrollView
        ref={scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        contentContainerStyle={styles.breadcrumbs}
        style={styles.breadcrumbScroll}
      >
        {[rootLabel, ...path].map((name, index) => (
          <View key={index} style={styles.crumb}>
            {index > 0 && <Icon name="chevron-forward" size={13} tint={color.muted} />}
            {index === path.length ? (
              <View style={styles.crumbLabel}>
                {index === 0 && <Icon name="folder-outline" size={15} />}
                <Text numberOfLines={1} style={styles.currentCrumb}>{name}</Text>
              </View>
            ) : (
              <Pressable accessibilityRole="button" accessibilityLabel={`Перейти до ${name}`} onPress={() => open(path.slice(0, index))} style={({ pressed }) => [styles.crumbLabel, pressed && ui.pressed]}>
                <Text numberOfLines={1} style={ui.caption}>{name}</Text>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function FileRow({ item, onOpen, onDelete }: { item: Entry; onOpen: () => void; onDelete: () => void }) {
  const folder = item.kind === 'folder';
  const description = folder ? 'Папка' : `${extension(item.name).toUpperCase() || 'Файл'} · ${formatSize(item.size)}`;
  return (
    <View style={[ui.card, styles.row]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Відкрити ${item.name}`} onPress={onOpen} style={({ pressed }) => [styles.rowOpen, pressed && ui.pressed]}>
        <View style={[styles.rowIcon, folder && styles.rowFolder]}><Icon name={folder ? 'folder' : 'document-text-outline'} tint={folder ? color.accent : color.muted} /></View>
        <View style={styles.rowCopy}>
          <Text numberOfLines={1} style={ui.label}>{item.name}</Text>
          <Text style={ui.caption}>{description}</Text>
        </View>
        <Icon name="chevron-forward" size={15} tint={color.muted} />
      </Pressable>
      <View style={styles.rowDelete}><IconButton quiet icon="trash-outline" label={`Видалити ${item.name}`} onPress={onDelete} /></View>
    </View>
  );
}

function deletePrompt(entry: Entry) {
  return entry.kind === 'folder'
    ? { title: 'Видалити папку?', body: `«${entry.name}» і весь її вміст буде видалено.` }
    : { title: 'Видалити файл?', body: `Файл «${entry.name}» буде видалено зі сховища.` };
}

export default function ExplorerScreen() {
  const router = useRouter();
  const { directory = '[]' } = useLocalSearchParams<{ directory?: string }>();
  const path = useMemo(() => readPath(directory), [directory]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [stats, setStats] = useState<Capacity | null>(null);
  const [revision, setRevision] = useState(0);
  const [creating, setCreating] = useState<Kind | null>(null);
  const [confirming, setConfirming] = useState<Entry | null>(null);
  const [notice, setNotice] = useState('');
  const deleting = useRef(false);
  const key = `${revision}:${typeof directory === 'string' ? directory : ''}`;
  const current = listing?.key === key ? listing : null;
  const entries = current?.entries ?? [];
  const prompt = confirming && deletePrompt(confirming);

  function reload() {
    setNotice('');
    setRevision((value) => value + 1);
  }

  useFocusEffect(useCallback(() => {
    let active = true;
    if (path) {
      storage.list(path).then((result) => {
        if (active) setListing({ key, entries: result });
      }).catch((error: unknown) => {
        if (active) setListing({ key, entries: [], error: errorText(error, 'Не вдалося відкрити папку. Перевір шлях або повернися вище.') });
      });
    }
    storage.capacity().then((result) => {
      if (active) setStats(result);
    }).catch(() => {
      if (active) setStats(null);
    });
    return () => { active = false; };
  }, [path, key]));

  const openFolder = useCallback((target: Path) => {
    setNotice('');
    router.setParams({ directory: routePath(target) });
  }, [router]);

  useFocusEffect(useCallback(() => {
    if (Platform.OS !== 'android' || !path?.length) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      openFolder(path.slice(0, -1));
      return true;
    });
    return () => subscription.remove();
  }, [openFolder, path]));

  function openEntry(item: Entry) {
    if (!path) return;
    const target = [...path, item.name];
    if (item.kind === 'folder') openFolder(target);
    else router.push({ pathname: '/file', params: { location: routePath(target) } });
  }

  async function remove(item: Entry) {
    if (!path || deleting.current) return;
    deleting.current = true;
    setConfirming(null);
    try {
      await storage.remove([...path, item.name], item.kind);
      reload();
    } catch (error) {
      setNotice(errorText(error, 'Не вдалося видалити елемент. Онови список і спробуй ще раз.'));
    } finally {
      deleting.current = false;
    }
  }

  function askToDelete(item: Entry) {
    if (deleting.current) return;
    if (Platform.OS === 'web') {
      setConfirming(item);
      return;
    }
    const { title, body } = deletePrompt(item);
    Alert.alert(title, body, [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => void remove(item) },
    ], { cancelable: true });
  }

  const count = countRule.select(entries.length);
  const countLabel = count === 'one' || count === 'few' ? countLabels[count] : countLabels.other;
  const unavailable = !path || !current || !!current.error;

  return (
    <Screen>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.name}
        contentContainerStyle={ui.page}
        renderItem={({ item }) => <FileRow item={item} onOpen={() => openEntry(item)} onDelete={() => askToDelete(item)} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}><Icon name="folder-open" size={22} tint={color.onAccent} /></View>
              <Text accessibilityRole="header" style={[ui.title, styles.brandTitle]}>Файловий менеджер</Text>
              <IconButton icon="refresh" label="Оновити список і статистику" onPress={reload} />
            </View>
            <StorageCard stats={stats} />
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <Text accessibilityRole="header" style={ui.heading}>Файли</Text>
                {current && !current.error && <Text style={ui.caption}>{entries.length} {countLabel}</Text>}
              </View>
              {path ? <Breadcrumbs path={path} open={openFolder} /> : <Button label="До документів" outline onPress={() => openFolder([])} />}
              <View style={styles.actions}>
                <Button label="Нова папка" icon="folder-outline" outline disabled={unavailable} onPress={() => setCreating('folder')} style={styles.action} />
                <Button label="Новий файл" icon="add" disabled={unavailable} onPress={() => setCreating('file')} style={styles.action} />
              </View>
              {notice ? <Notice>{notice}</Notice> : null}
            </View>
          </View>
        )}
        ListEmptyComponent={!path ? <Notice>Шлях до папки некоректний.</Notice> : current?.error ? <Notice>{current.error}</Notice> : current ? (
          <View style={[ui.card, styles.empty]}>
            <View style={styles.rowIcon}><Icon name="folder-open-outline" size={23} /></View>
            <Text style={ui.heading}>Папка порожня</Text>
            <Text style={ui.body}>Створи папку або текстовий файл.</Text>
          </View>
        ) : <ActivityIndicator color={color.accent} style={styles.spinner} />}
      />
      {creating && path && (
        <EntryForm kind={creating} onClose={() => setCreating(null)} submit={async (name, text) => {
          if (creating === 'folder') await storage.createFolder(path, name);
          else await storage.createText(path, name, text);
          reload();
        }} />
      )}
      {confirming && prompt && (
        <Dialog title={prompt.title} onClose={() => setConfirming(null)}>
          <Text style={ui.body}>{prompt.body}</Text>
          <View style={dialogActions.row}>
            <Button label="Скасувати" outline onPress={() => setConfirming(null)} style={dialogActions.button} />
            <Button label="Видалити" onPress={() => void remove(confirming)} style={dialogActions.button} />
          </View>
        </Dialog>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 19 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandTitle: { flex: 1 },
  brandIcon: { width: 44, height: 44, backgroundColor: color.accent, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  storage: { backgroundColor: color.accent, borderRadius: 18, padding: 16, gap: 13 },
  storageHead: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  storageTitle: { flex: 1, color: color.onAccent, fontFamily: font.bold, fontSize: 16, lineHeight: 22 },
  storageStatus: { color: color.onAccentMuted, fontFamily: font.bold, fontSize: 11, lineHeight: 16 },
  track: { backgroundColor: color.accentTrack, overflow: 'hidden', borderRadius: 5, height: 6 },
  fill: { backgroundColor: color.onAccent, height: 6, borderRadius: 5 },
  metrics: { flexDirection: 'row' },
  metric: { flex: 1, gap: 4, paddingRight: 5 },
  metricBorder: { borderLeftWidth: 1, borderLeftColor: color.accentLine, paddingLeft: 11 },
  metricLabel: { color: color.onAccentMuted, fontFamily: font.medium, fontSize: 12, lineHeight: 16 },
  metricValue: { color: color.onAccent, fontFamily: font.bold, fontSize: 15, lineHeight: 21 },
  section: { gap: 10, paddingTop: 2 },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  breadcrumbScroll: { flex: 1, backgroundColor: color.panel, borderColor: color.line, borderRadius: 11, borderWidth: 1 },
  breadcrumbs: { alignItems: 'center', minHeight: 42, paddingHorizontal: 10, gap: 4 },
  crumb: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  crumbLabel: { minHeight: 40, maxWidth: 220, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 3, gap: 7 },
  currentCrumb: { flexShrink: 1, color: color.accent, fontFamily: font.bold, fontSize: 12, lineHeight: 17 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 65 },
  rowOpen: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 11, gap: 10 },
  rowIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: color.raised },
  rowFolder: { backgroundColor: color.accentMuted },
  rowCopy: { flex: 1, minWidth: 0, gap: 2 },
  rowDelete: { borderLeftWidth: 1, borderLeftColor: color.line, marginRight: 4 },
  empty: { alignItems: 'center', gap: 7, paddingVertical: 24, paddingHorizontal: 12 },
  spinner: { marginVertical: 24 },
});
