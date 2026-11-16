import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const color = {
  bg: '#121212',
  card: '#1D1D1B',
  raised: '#292925',
  ink: '#F7F6EE',
  muted: '#B8B6AA',
  line: '#393832',
  primary: '#FFD334',
  onPrimary: '#171307',
  accentSoft: '#392F16',
  accentBorder: '#78612A',
  track: '#46443A',
  arena: '#10100E',
  arenaLine: '#414037',
  orbit: '#6F613B',
  gold: '#FFD83D',
  goldRim: '#C4961B',
  goldHighlight: '#FFE78B',
  goldInner: '#EBB620',
  backdrop: 'rgba(0, 0, 0, 0.72)',
};

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
  display: 'Rubik_600SemiBold',
};

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, tint = color.primary, size = 20 }: { name: IconName; tint?: string; size?: number }) {
  return <Ionicons name={name} color={tint} size={size} aria-hidden />;
}

export function Button({ title, icon, onPress, variant = 'secondary', style, label, disabled }: {
  title?: string; label?: string; icon?: IconName; onPress: () => void; variant?: 'secondary' | 'primary' | 'danger';
  style?: StyleProp<ViewStyle>; disabled?: boolean;
}) {
  const tint = variant === 'primary' ? color.onPrimary : color.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button, styles[variant], !title && styles.iconButton,
        style, pressed && styles.pressed, disabled && styles.disabled,
      ]}
    >
      {icon && <Icon name={icon} tint={tint} size={19} />}
      {title && <Text style={[styles.buttonText, { color: tint }]}>{title}</Text>}
    </Pressable>
  );
}

export function AppHeader() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.brandMark}><Icon name="flash" tint={color.onPrimary} size={22} /></View>
        <Text style={styles.brand}>Clicker</Text>
      </View>
    </SafeAreaView>
  );
}

export function Page({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['left', 'right']} style={theme.fill}>
      <ScrollView contentContainerStyle={styles.page}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: Math.min(value, max) }}
      style={styles.track}
    >
      <View style={[styles.fillBar, { width: (Math.min(value, max) / max * 100) + '%' }]} />
    </View>
  );
}

export const theme = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.bg },
  card: { backgroundColor: color.card, borderColor: color.line, borderWidth: 1, borderRadius: 17 },
  title: { fontFamily: font.display, fontSize: 30, lineHeight: 37, color: color.ink, letterSpacing: -0.6 },
  heading: { fontFamily: font.display, fontSize: 18, lineHeight: 24, color: color.ink },
  body: { fontFamily: font.regular, color: color.muted, fontSize: 14, lineHeight: 21 },
  small: { fontFamily: font.medium, color: color.muted, fontSize: 12, lineHeight: 18 },
  label: { fontFamily: font.bold, color: color.ink, fontSize: 14, lineHeight: 20 },
});

const styles = StyleSheet.create({
  header: { backgroundColor: color.card, borderBottomColor: color.line, borderBottomWidth: 1 },
  headerContent: {
    minHeight: 56, alignSelf: 'center', width: '100%', maxWidth: 1170, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', gap: 9,
  },
  brandMark: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: color.primary },
  brand: { color: color.ink, fontFamily: font.display, fontSize: 24, lineHeight: 29, letterSpacing: -0.6 },
  button: {
    minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    borderRadius: 9, paddingHorizontal: 11, borderWidth: 1,
  },
  primary: { backgroundColor: color.primary, borderColor: color.primary },
  secondary: { backgroundColor: color.raised, borderColor: color.line },
  danger: { backgroundColor: color.accentSoft, borderColor: color.accentBorder },
  iconButton: { width: 42, paddingHorizontal: 0 },
  buttonText: { fontFamily: font.bold, fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.48 },
  page: { width: '100%', maxWidth: 870, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 19, paddingBottom: 28, gap: 14 },
  track: { overflow: 'hidden', backgroundColor: color.track, height: 7, borderRadius: 6 },
  fillBar: { height: '100%', backgroundColor: color.primary, borderRadius: 6 },
});
