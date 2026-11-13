import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useProfile } from './profile-context';

export const colors = { blue: '#264B96', ink: '#14243B', muted: '#70819B', border: '#DAE3EF', bg: '#F5F7FB', white: '#FFFFFF' };
export function Header() {
  const { profile } = useProfile();
  return <View style={s.header}>
    <Image source={require('../assets/image-4.png')} style={s.logo} accessibilityLabel="Логотип новин університету" />
    <View style={{ flex: 1 }}><Text style={s.headerTitle}>Лабораторна робота 1</Text><Text numberOfLines={1} style={s.subtitle}>{profile.name.split(' ').slice(0, 2).join(' ')}, {profile.group}</Text></View>
    <IconButton name="settings-outline" label="Налаштування профілю" onPress={() => router.navigate('/profile')} />
  </View>;
}
export function Screen({ children }: React.PropsWithChildren) {
  return <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}><View style={s.frame}><Header />{children}</View></SafeAreaView>;
}
export function IconButton({ name, label, onPress, active = false }: { name: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void; active?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.iconButton, active && { backgroundColor: colors.blue }, pressed && { opacity: .65 }]}><Ionicons name={name} size={22} color={active ? 'white' : colors.blue} /></Pressable>;
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, frame: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { width: 40, height: 40, resizeMode: 'contain' }, headerTitle: { fontSize: 17, fontWeight: '700', color: colors.ink }, subtitle: { fontSize: 11, color: colors.muted, marginTop: 4 },
  iconButton: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF2FA' },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink }, body: { fontSize: 15, lineHeight: 23, color: '#4C5E78' },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.bg, padding: 12, fontSize: 15, color: colors.ink },
  label: { fontSize: 13, color: '#4C5E78', fontWeight: '600', marginBottom: 7 },
});
