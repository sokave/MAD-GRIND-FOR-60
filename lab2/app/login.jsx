import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { demoAccount, useAuth } from '../src/auth';
import { Brand } from '../src/Brand';
import { campusPhoto } from '../src/news';
import { colors, fonts, shared } from '../src/theme';

export default function LoginScreen() {
  const { isAuthenticated, login } = useAuth();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const wide = width >= 820;

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  function submit() {
    if (!email.trim() || !password) {
      setError('Введи електронну пошту й пароль.');
      return;
    }

    if (!login(email, password)) {
      setError('Неправильна пошта або пароль. Звір дані з прикладом нижче.');
    }
  }

  return (
    <SafeAreaView style={shared.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.page, wide && styles.widePage]}
        >
          <View style={[styles.panel, wide && styles.widePanel]}>
            {wide && (
              <View style={styles.cover}>
                <Image
                  source={campusPhoto}
                  resizeMode="cover"
                  style={[StyleSheet.absoluteFill, styles.coverImage]}
                />
                <View style={[StyleSheet.absoluteFill, styles.overlay]} />
                <View style={styles.coverCopy}>
                  <View style={styles.coverRule} />
                  <Text style={styles.coverLabel}>ЖИТОМИРСЬКА ПОЛІТЕХНІКА</Text>
                  <Text accessibilityRole="header" style={styles.coverTitle}>
                    Життя кампусу
                  </Text>
                  <Text style={styles.coverDescription}>
                    Університетські події, новини та можливості для студентів.
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.form, wide && styles.wideForm]}>
              <Brand />
              <View style={styles.intro}>
                <Text accessibilityRole="header" style={shared.pageHeading}>
                  Вхід до кампусу
                </Text>
                <Text style={shared.body}>Увійди, щоб відкрити стрічку новин і довідку.</Text>
              </View>

              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.label}>Електронна пошта</Text>
                  <View style={styles.inputBox}>
                    <Ionicons name="mail-outline" size={19} color={colors.muted} />
                    <TextInput
                      accessibilityLabel="Електронна пошта"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      placeholder="student@example.com"
                      placeholderTextColor={colors.muted}
                      style={styles.input}
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        setError('');
                      }}
                    />
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Пароль</Text>
                  <View style={styles.inputBox}>
                    <Ionicons name="lock-closed-outline" size={19} color={colors.muted} />
                    <TextInput
                      accessibilityLabel="Пароль"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect={false}
                      placeholder="Введи пароль"
                      placeholderTextColor={colors.muted}
                      secureTextEntry={!visible}
                      style={styles.input}
                      value={password}
                      returnKeyType="go"
                      onSubmitEditing={submit}
                      onChangeText={(value) => {
                        setPassword(value);
                        setError('');
                      }}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={visible ? 'Приховати пароль' : 'Показати пароль'}
                      onPress={() => setVisible((current) => !current)}
                      hitSlop={3}
                      style={styles.reveal}
                    >
                      <Ionicons
                        name={visible ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.muted}
                      />
                    </Pressable>
                  </View>
                </View>

                {error ? (
                  <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
                    {error}
                  </Text>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Увійти"
                  onPress={submit}
                  style={({ pressed }) => [styles.submit, pressed && shared.pressed]}
                >
                  <Text style={styles.submitText}>Увійти</Text>
                  <Ionicons name="arrow-forward-outline" size={20} color={colors.surface} />
                </Pressable>
              </View>

              <View style={styles.demo}>
                <Ionicons name="information-circle-outline" size={20} color={colors.blue} />
                <View style={styles.demoCopy}>
                  <Text style={styles.demoTitle}>Демонстраційний обліковий запис</Text>
                  <Text selectable style={styles.demoText}>{demoAccount.email} · {demoAccount.password}</Text>
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
  flex: { flex: 1 },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  widePage: {
    paddingHorizontal: 44,
    paddingVertical: 40,
  },
  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    overflow: 'hidden',
  },
  widePanel: {
    maxWidth: 1080,
    minHeight: 590,
    flexDirection: 'row',
    borderRadius: 28,
  },
  cover: {
    flex: 1.1,
    justifyContent: 'flex-end',
    backgroundColor: colors.navy,
    minWidth: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(12, 27, 58, 0.64)',
  },
  coverCopy: {
    gap: 11,
    padding: 46,
  },
  coverRule: {
    width: 38,
    height: 4,
    marginBottom: 6,
    borderRadius: 2,
    backgroundColor: '#B6CCFF',
  },
  coverLabel: {
    color: '#DDE7FF',
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 1.5,
  },
  coverTitle: {
    color: colors.surface,
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 53,
    letterSpacing: -1.4,
  },
  coverDescription: {
    color: '#ECF2FF',
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 330,
  },
  form: {
    gap: 24,
    paddingHorizontal: 22,
    paddingVertical: 26,
  },
  wideForm: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: 44,
    paddingVertical: 44,
  },
  intro: { gap: 7 },
  fields: { gap: 15 },
  field: { gap: 7 },
  label: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 19,
  },
  inputBox: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 13,
    paddingRight: 8,
    backgroundColor: '#F8FAFE',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingVertical: 10,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  reveal: {
    minWidth: 38,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    minHeight: 50,
    marginTop: 3,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 11,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  submitText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 22,
  },
  demo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 11,
    backgroundColor: colors.blueLight,
  },
  demoCopy: {
    flex: 1,
    gap: 3,
  },
  demoTitle: {
    color: colors.navy,
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 17,
  },
  demoText: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: colors.red,
    backgroundColor: colors.redLight,
    borderRadius: 8,
    padding: 10,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 19,
  },
});
