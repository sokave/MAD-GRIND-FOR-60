import type { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModalFrame } from './ModalFrame';
import { Button, IconButton, colors, theme } from './ui';

export function FilterSheet({ title, onApply, onReset, onClose, children }: PropsWithChildren<{
  title: string; onApply: () => void; onReset: () => void; onClose: () => void;
}>) {
  return (
    <ModalFrame title={title} onClose={onClose} sheet>
      <ScrollView nestedScrollEnabled style={styles.scroll} contentContainerStyle={styles.content}>
        {Platform.OS === 'web' && <View style={styles.grip} />}
        <View style={styles.header}>
          <Text accessibilityRole="header" style={theme.subhead}>{title}</Text>
          <IconButton label="Закрити фільтри" icon="close-outline" onPress={onClose} />
        </View>
        {children}
        <View style={styles.actions}>
          <Button title="Скинути" variant="secondary" onPress={onReset} />
          <Button title="Застосувати" icon="checkmark-outline" onPress={onApply} />
        </View>
      </ScrollView>
    </ModalFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, flexShrink: 1, minHeight: 0 },
  content: { padding: 20, gap: 18, width: '100%', maxWidth: 620, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  grip: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: colors.line },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
});
