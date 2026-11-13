import { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { news } from '../../src/data';
import { colors, IconButton, Screen, s } from '../../src/ui';
export default function Gallery() {
  const [grid, setGrid] = useState(true);
  const [selected, setSelected] = useState<(typeof news)[number] | null>(null);
  return <Screen><View style={styles.toolbar}><View style={{ flex: 1 }}><Text style={s.title}>Фотогалерея</Text><Text style={s.body}>{news.length} світлини університету</Text></View><IconButton name="grid-outline" label="Показати сіткою" active={grid} onPress={() => setGrid(true)} /><IconButton name="list-outline" label="Показати списком" active={!grid} onPress={() => setGrid(false)} /></View>
    <FlatList key={grid ? 'grid' : 'list'} data={news} numColumns={grid ? 2 : 1} keyExtractor={item => item.id} contentContainerStyle={styles.list} columnWrapperStyle={grid ? { gap: 12 } : undefined} renderItem={({ item }) => <Pressable onPress={() => setSelected(item)} accessibilityRole="button" accessibilityLabel={`Відкрити фото: ${item.title}`} style={[s.card, { flex: 1 }]}><Image source={item.image} style={{ width: '100%', aspectRatio: grid ? 1.25 : 1.8, resizeMode: 'cover' }} /><View style={{ padding: 12, gap: 6 }}><Text style={styles.category}>{item.category}</Text><Text numberOfLines={grid ? 2 : 3} style={styles.caption}>{item.title}</Text></View></Pressable>} />
    <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}><SafeAreaView style={styles.overlay}><View style={{ alignSelf: 'flex-end' }}><IconButton name="close" label="Закрити фото" onPress={() => setSelected(null)} /></View>{selected && <><Image source={selected.image} style={{ flex: 1, width: '100%', resizeMode: 'contain' }} /><Text style={styles.modalTitle}>{selected.title}</Text></>}</SafeAreaView></Modal>
  </Screen>;
}
const styles = StyleSheet.create({ toolbar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 }, list: { padding: 16, paddingTop: 0, gap: 12 }, category: { fontSize: 11, color: colors.blue }, caption: { color: colors.ink, fontWeight: '600', fontSize: 14, lineHeight: 20 }, overlay: { flex: 1, padding: 20, backgroundColor: '#101C31F5' }, modalTitle: { color: 'white', fontSize: 18, textAlign: 'center', padding: 20 } });
