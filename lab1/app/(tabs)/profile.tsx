import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useProfile } from '../../src/profile-context';
import { colors, Screen, s } from '../../src/ui';
export default function ProfileScreen() {
  const { profile, ready, save } = useProfile();
  const [draft, setDraft] = useState(profile);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setDraft(profile); }, [profile]);
  function change(key: 'name' | 'email' | 'group', value: string) { setDraft(p => ({ ...p, [key]: value })); setMessage(''); }
  async function submit() {
    const next = { ...draft, name: draft.name.trim(), email: draft.email.trim(), group: draft.group.trim() };
    if (!next.name || !next.group || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) { setMessage('Заповніть ПІБ, групу та коректну адресу email.'); return; }
    setBusy(true);
    try { await save(next); setMessage('Профіль збережено на цьому пристрої.'); } catch { setMessage('Не вдалося зберегти. Спробуйте ще раз.'); } finally { setBusy(false); }
  }
  return <Screen><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 28 }}>
    <View style={styles.banner}><Text style={styles.bannerTitle}>Мій профіль</Text><Text style={styles.bannerText}>Особистий простір студента</Text></View><View style={styles.avatar}><Ionicons name="person" size={62} color={colors.muted} /></View>
    {!ready ? <ActivityIndicator accessibilityLabel="Завантаження профілю" /> : <View style={styles.form}><View><Text style={s.label}>ПІБ</Text><TextInput accessibilityLabel="ПІБ" style={s.input} value={draft.name} onChangeText={v => change('name', v)} autoComplete="name" maxLength={100} /></View>
      <View style={[s.card, styles.section]}><Text style={styles.sectionTitle}>КОНТАКТИ</Text><View><Text style={s.label}>Email</Text><TextInput accessibilityLabel="Email" style={s.input} value={draft.email} onChangeText={v => change('email', v)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" maxLength={150} /></View><View><Text style={s.label}>Група</Text><TextInput accessibilityLabel="Група" style={s.input} value={draft.group} onChangeText={v => change('group', v)} maxLength={30} /></View></View>
      <View style={[s.card, styles.section]}><Text style={styles.sectionTitle}>НАЛАШТУВАННЯ</Text><View style={styles.row}><Ionicons name="notifications-outline" size={22} color={colors.blue} /><Text style={[s.body, { flex: 1 }]}>Сповіщення</Text><Switch accessibilityLabel="Сповіщення" value={draft.notifications} onValueChange={v => { setDraft(p => ({ ...p, notifications: v })); setMessage(''); }} trackColor={{ false: '#C7D3E4', true: '#9BC4FF' }} thumbColor={draft.notifications ? colors.blue : '#FAFAFA'} /></View><Text style={styles.hint}>Навчальне налаштування; push-сповіщення не підключені.</Text></View>
      <View style={styles.row}><Pressable disabled={busy} accessibilityRole="button" onPress={() => { setDraft(profile); setMessage('Зміни скасовано.'); }} style={[styles.button, { backgroundColor: '#E8EEF8' }]}><Text style={{ color: colors.blue, fontWeight: '600' }}>Скасувати</Text></Pressable><Pressable disabled={busy} accessibilityRole="button" onPress={submit} style={[styles.button, { backgroundColor: colors.blue, opacity: busy ? .6 : 1 }]}><Text style={{ color: 'white', fontWeight: '600' }}>{busy ? 'Збереження…' : 'Зберегти'}</Text></Pressable></View>
      {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}<Text style={styles.hint}>Початкові дані демонстраційні. Вкажіть свої перед здачею.</Text>
    </View>}
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({ banner: { backgroundColor: colors.blue, padding: 24, paddingBottom: 60, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }, bannerTitle: { color: 'white', fontWeight: '700', fontSize: 26 }, bannerText: { color: '#D5E2FF', marginTop: 6 }, avatar: { alignSelf: 'center', marginTop: -46, width: 104, height: 104, borderRadius: 52, borderWidth: 5, borderColor: 'white', backgroundColor: '#E8EDF5', alignItems: 'center', justifyContent: 'center' }, form: { padding: 20, gap: 20 }, section: { padding: 16, gap: 16 }, sectionTitle: { fontSize: 12, letterSpacing: .8, fontWeight: '700', color: colors.muted }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, hint: { fontSize: 12, lineHeight: 18, color: colors.muted }, button: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 12 } });
