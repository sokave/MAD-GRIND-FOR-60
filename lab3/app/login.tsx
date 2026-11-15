import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdmin } from '../src/admin';
import { adminAccount, coverUrls } from '../src/data';
import { NewsImage } from '../src/NewsImage';
import { Brand, Button, Field, Icon, Loading, Message, colors, fonts, theme } from '../src/ui';

export default function LoginScreen() {
  const { ready, isAuthenticated, login } = useAdmin();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const split = width >= 820;

  if (!ready) return <Loading />;
  if (isAuthenticated) return <Redirect href="/" />;

  function submit() {
    if (!email.trim() || !password) {
      setError('Введіть електронну пошту та пароль.');
    } else if (!login(email, password)) {
      setError('Неправильна пошта або пароль.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={theme.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <View style={[styles.panel, split && styles.split]}>
            {split && (
              <View style={styles.cover}>
                <NewsImage url={coverUrls.team} style={StyleSheet.absoluteFill} />
                <View style={styles.shade} />
                <View style={styles.coverCopy}>
                  <View style={styles.coverRule} />
                  <Text style={styles.coverTitle}>Портал новин кампусу</Text>
                  <Text style={styles.coverSubtitle}>Житомирська політехніка</Text>
                </View>
              </View>
            )}
            <View style={[styles.form, split && styles.splitForm]}>
              <Brand />
              <View style={styles.intro}>
                <Text accessibilityRole="header" style={theme.title}>Вхід до редакції</Text>
                <Text style={theme.body}>Увійдіть, щоб керувати новинами та обліковими записами.</Text>
              </View>
              <View style={styles.fields}>
                <Field
                  label="Електронна пошта"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  placeholder={adminAccount.email}
                  value={email}
                  onChangeText={(value) => { setEmail(value); setError(''); }}
                />
                <Field
                  label="Пароль"
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="go"
                  placeholder="Введіть пароль"
                  value={password}
                  onChangeText={(value) => { setPassword(value); setError(''); }}
                  onSubmitEditing={submit}
                />
                {!!error && <Message>{error}</Message>}
                <Button title="Увійти" icon="arrow-forward-outline" onPress={submit} />
              </View>
              <View style={styles.demo}>
                <Icon name="information-circle-outline" size={19} />
                <View style={styles.demoText}>
                  <Text style={theme.label}>Демонстраційний обліковий запис</Text>
                  <Text selectable style={theme.small}>{adminAccount.email} · {adminAccount.password}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  page: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  panel: {
    width: '100%', maxWidth: 465, alignSelf: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: colors.line, borderRadius: 22, backgroundColor: colors.surface,
  },
  split: { maxWidth: 1030, minHeight: 548, flexDirection: 'row' },
  cover: { flex: 1, minWidth: 0, justifyContent: 'flex-end', overflow: 'hidden', backgroundColor: colors.greenDeep },
  shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(19, 45, 36, 0.62)' },
  coverCopy: { padding: 38, gap: 10, minWidth: 0 },
  coverRule: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CEF3DC' },
  coverTitle: { fontFamily: fonts.display, color: colors.surface, fontSize: 41, lineHeight: 48, maxWidth: 330 },
  coverSubtitle: { fontFamily: fonts.medium, color: '#E5F6ED', fontSize: 16, lineHeight: 24 },
  form: { padding: 23, gap: 24, justifyContent: 'center' },
  splitForm: { flex: 1, minWidth: 0, padding: 42 },
  intro: { gap: 6 },
  fields: { gap: 14 },
  demo: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: colors.mint, padding: 12, borderRadius: 10 },
  demoText: { flex: 1, gap: 4 },
});
