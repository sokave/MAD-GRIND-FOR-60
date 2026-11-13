import { useState } from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { news } from '../../src/data';
import { colors, IconButton, Screen, s } from '../../src/ui';
export default function Home() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<(typeof news)[number] | null>(null);
  const filtered = news.filter(item => `${item.title} ${item.text} ${item.category}`.toLocaleLowerCase('uk').includes(query.trim().toLocaleLowerCase('uk')));
  return <Screen>
    <FlatList data={filtered} keyExtractor={item => item.id} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View style={{ gap: 12 }}><View><Text style={s.title}>Новини університету</Text><Text style={s.body}>Навчання. Люди. Можливості.</Text></View><View style={styles.search}><Ionicons name="search" size={20} color={colors.muted} /><TextInput accessibilityLabel="Пошук новин" placeholder="Пошук новин…" value={query} onChangeText={setQuery} style={styles.searchInput} placeholderTextColor={colors.muted} />{query !== '' && <IconButton name="close" label="Очистити пошук" onPress={() => setQuery('')} />}</View><Text style={styles.note}>Навчальна стрічка • Знайдено: {filtered.length}</Text></View>}
      ListEmptyComponent={<Text style={[s.body, { paddingVertical: 30 }]}>Нічого не знайдено. Спробуйте інший запит.</Text>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`Читати: ${item.title}`} onPress={() => setSelected(item)} style={({ pressed }) => [s.card, pressed && { opacity: .8 }]}><Image source={item.image} style={styles.cover} /><View style={styles.content}><Text style={styles.category}>{item.category.toUpperCase()}</Text><Text style={styles.heading}>{item.title}</Text><Text style={styles.note}>{item.date}</Text><Text numberOfLines={3} style={s.body}>{item.text}</Text><Text style={styles.more}>Читати далі →</Text></View></Pressable>} />
    <Modal visible={selected !== null} animationType="slide" onRequestClose={() => setSelected(null)}><SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}><ScrollView contentContainerStyle={{ padding: 20, gap: 16, maxWidth: 760, width: '100%', alignSelf: 'center' }}><IconButton name="close" label="Закрити новину" onPress={() => setSelected(null)} />{selected && <><Image source={selected.image} style={styles.cover} /><Text style={s.title}>{selected.title}</Text><Text style={styles.note}>{selected.date} • Навчальний матеріал</Text><Text style={s.body}>{selected.text}</Text></>}</ScrollView></SafeAreaView></Modal>
  </Screen>;
}
const styles = StyleSheet.create({
  list: { padding: 16, gap: 16, paddingBottom: 28 }, search: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 12, minHeight: 48, backgroundColor: 'white', borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.ink }, cover: { width: '100%', height: 180, resizeMode: 'cover' }, content: { padding: 16, gap: 9 }, heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: colors.ink }, category: { fontSize: 10, letterSpacing: 1.5, color: colors.blue, fontWeight: '700' }, note: { fontSize: 12, color: colors.muted }, more: { color: colors.blue, fontWeight: '600', marginTop: 3 },
});

