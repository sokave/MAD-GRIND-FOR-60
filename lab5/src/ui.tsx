import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const color = {
  background: '#101412',
  panel: '#19201C',
  raised: '#222C26',
  line: '#334038',
  text: '#F1F8F3',
  muted: '#ABB9AE',
  accent: '#62E89B',
  accentMuted: '#21382A',
  onAccent: '#102418',
  onAccentMuted: '#214631',
  accentLine: '#36A56F',
  accentTrack: '#4BC27E',
  shade: 'rgba(0, 0, 0, 0.72)',
};

export const font = {
  normal: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
};

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 19, tint = color.accent }: { name: IconName; size?: number; tint?: string }) {
  return <Ionicons accessible={false} name={name} size={size} color={tint} />;
}

export function IconButton({ icon, label, onPress, quiet, disabled }: {
  icon: IconName; label: string; onPress: () => void; quiet?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, !quiet && styles.iconBorder, pressed && ui.pressed, disabled && ui.disabled]}
    >
      <Icon name={icon} tint={quiet ? color.muted : color.accent} />
    </Pressable>
  );
}

export function Button({ label, icon, outline, disabled, onPress, style }: {
  label: string; icon?: IconName; outline?: boolean; disabled?: boolean; onPress: () => void; style?: StyleProp<ViewStyle>;
}) {
  const tint = outline ? color.accent : color.onAccent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, outline ? styles.outline : styles.filled, style, pressed && ui.pressed, disabled && ui.disabled]}
    >
      {icon && <Icon name={icon} size={17} tint={tint} />}
      <Text style={[ui.buttonLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={ui.screen}>{children}</SafeAreaView>;
}

export function Notice({ children }: { children: string }) {
  return (
    <View style={styles.notice}>
      <Icon name="information-circle-outline" />
      <Text accessibilityRole="alert" style={styles.noticeText}>{children}</Text>
    </View>
  );
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.background },
  page: { width: '100%', maxWidth: 704, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28, gap: 12 },
  card: { backgroundColor: color.panel, borderWidth: 1, borderColor: color.line, borderRadius: 16 },
  title: { color: color.text, fontFamily: font.bold, fontSize: 24, lineHeight: 31 },
  heading: { color: color.text, fontFamily: font.bold, fontSize: 17, lineHeight: 23 },
  label: { color: color.text, fontFamily: font.medium, fontSize: 14, lineHeight: 20 },
  body: { color: color.muted, fontFamily: font.normal, fontSize: 14, lineHeight: 21 },
  caption: { color: color.muted, fontFamily: font.medium, fontSize: 12, lineHeight: 17 },
  buttonLabel: { fontFamily: font.bold, fontSize: 13, lineHeight: 18, textAlign: 'center', flexShrink: 1 },
  pressed: { opacity: 0.74 },
  disabled: { opacity: 0.5 },
});

const styles = StyleSheet.create({
  iconButton: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  iconBorder: { borderColor: color.line, borderWidth: 1, backgroundColor: color.panel },
  button: { minHeight: 46, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderRadius: 11, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
  outline: { backgroundColor: color.panel, borderColor: color.line },
  filled: { backgroundColor: color.accent, borderColor: color.accent },
  notice: { padding: 11, borderWidth: 1, borderColor: color.line, backgroundColor: color.accentMuted, borderRadius: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  noticeText: { flex: 1, color: color.accent, fontFamily: font.medium, fontSize: 13, lineHeight: 19 },
});
