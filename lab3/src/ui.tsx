import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View,
  type StyleProp, type TextInputProps, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initials } from './data';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export const colors = {
  bg: '#F5F5EF',
  surface: '#FFFFFF',
  paper: '#FAFAF6',
  ink: '#1D3029',
  muted: '#53665D',
  line: '#DFE5DD',
  green: '#245848',
  greenDeep: '#173D34',
  mint: '#E3F0E9',
  clay: '#A05237',
  claySoft: '#F7E9DE',
  gold: '#815617',
  goldSoft: '#F9EED9',
  violet: '#57516E',
  violetSoft: '#EEEAF6',
  red: '#983B3D',
  redSoft: '#F9E8E7',
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  display: 'Rubik_500Medium',
};

export const desktopWidth = 980;
export const theme = StyleSheet.create({
  fill: { flex: 1 },
  title: { fontFamily: fonts.display, color: colors.ink, fontSize: 31, lineHeight: 39, letterSpacing: -0.8 },
  subhead: { fontFamily: fonts.display, color: colors.ink, fontSize: 19, lineHeight: 26, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, color: colors.muted, fontSize: 14, lineHeight: 21 },
  small: { fontFamily: fonts.medium, color: colors.muted, fontSize: 12, lineHeight: 17 },
  strong: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 13, lineHeight: 18 },
  card: { borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  input: {
    minHeight: 46,
    minWidth: 0,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  pressed: { opacity: 0.74 },
});

export function Icon({ name, size = 20, color = colors.green }: {
  name: IconName; size?: number; color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} aria-hidden />;
}

export function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandMark}><Icon name="newspaper-outline" size={22} color={colors.surface} /></View>
      <View>
        <Text style={styles.brandName}>Кампус</Text>
        <Text style={styles.brandLabel}>Редакція</Text>
      </View>
    </View>
  );
}

export function Avatar({ name, admin = false }: { name: string; admin?: boolean }) {
  return (
    <View style={[styles.avatar, admin && styles.adminAvatar]}>
      <Text aria-hidden style={[styles.avatarText, admin && styles.adminAvatarText]}>{initials(name)}</Text>
    </View>
  );
}

export function Button({
  title, icon, onPress, variant = 'primary', label, disabled, style,
}: {
  title: string; icon?: IconName; onPress: () => void; label?: string;
  variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const tint = variant === 'primary' ? colors.surface : variant === 'danger' ? colors.red : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button, styles[variant], style, pressed && theme.pressed, disabled && styles.disabled,
      ]}
    >
      {icon && <Icon name={icon} size={18} color={tint} />}
      <Text style={[styles.buttonLabel, { color: tint }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ label, icon, onPress, danger }: {
  label: string; icon: IconName; onPress: () => void; danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, danger && styles.danger, pressed && theme.pressed]}
    >
      <Icon name={icon} color={danger ? colors.red : colors.green} />
    </Pressable>
  );
}

const tones = {
  green: { ink: colors.green, bg: colors.mint },
  gold: { ink: colors.gold, bg: colors.goldSoft },
  gray: { ink: colors.muted, bg: '#ECF0EB' },
  red: { ink: colors.red, bg: colors.redSoft },
};

export type Tone = keyof typeof tones;

export function Pill({ label, tone = 'gray' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.pill, { backgroundColor: tones[tone].bg }]}>
      <View style={[styles.dot, { backgroundColor: tones[tone].ink }]} />
      <Text numberOfLines={1} style={[styles.pillText, { color: tones[tone].ink }]}>{label}</Text>
    </View>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={theme.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[theme.input, style]}
        {...props}
      />
    </View>
  );
}

export function Choices<T extends string | null>({ label, options, value, onChange }: {
  label: string; options: readonly { value: T; label: string }[]; value: T; onChange: (next: T) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={theme.label}>{label}</Text>
      <View style={styles.choices} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value ?? 'all'}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && theme.pressed]}
            >
              {selected && <Icon name="checkmark" size={15} />}
              <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Message({ children }: PropsWithChildren) {
  return <Text accessibilityRole="alert" style={styles.message}>{children}</Text>;
}

export function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator accessibilityLabel="Завантаження" color={colors.green} />
    </View>
  );
}

export function Page({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.page}>
      <View style={styles.pageInner}>{children}</View>
    </SafeAreaView>
  );
}

export function PageIntro({ title, description, actions, children }: PropsWithChildren<{
  title: string; description?: string; actions?: ReactNode;
}>) {
  return (
    <View style={styles.intro}>
      <View style={styles.introRow}>
        <View style={styles.introText}>
          <Text accessibilityRole="header" style={theme.title}>{title}</Text>
          {description && <Text style={theme.body}>{description}</Text>}
        </View>
        {actions && <View style={styles.introActions}>{actions}</View>}
      </View>
      {children}
    </View>
  );
}

export function WorkspaceHeader({ title, onMenu, onBack }: {
  title: string; onMenu?: () => void; onBack?: () => void;
}) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
      <View style={styles.headerRow}>
        {onBack && <IconButton label="До новин" icon="arrow-back-outline" onPress={onBack} />}
        {!onBack && onMenu && <IconButton label="Відкрити меню" icon="menu-outline" onPress={onMenu} />}
        <Icon name="home-outline" size={16} color={colors.muted} />
        <Text style={theme.small}>Редакція</Text>
        <Icon name="chevron-forward-outline" size={14} color={colors.muted} />
        <Text numberOfLines={1} style={theme.strong}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: {
    width: 43, height: 43, borderRadius: 12, backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontFamily: fonts.display, color: colors.ink, fontSize: 23, lineHeight: 27, letterSpacing: -0.6 },
  brandLabel: { fontFamily: fonts.medium, color: colors.muted, fontSize: 12, lineHeight: 17 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.mint, flexShrink: 0,
  },
  avatarText: { color: colors.green, fontFamily: fonts.bold, fontSize: 13 },
  adminAvatar: { backgroundColor: colors.greenDeep },
  adminAvatarText: { color: colors.surface },
  button: {
    minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, paddingHorizontal: 13, gap: 7, borderRadius: 10, borderWidth: 1,
  },
  primary: { backgroundColor: colors.green, borderColor: colors.green },
  secondary: { backgroundColor: colors.surface, borderColor: colors.line },
  danger: { backgroundColor: colors.redSoft, borderColor: colors.redSoft },
  buttonLabel: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  disabled: { opacity: 0.56 },
  iconButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10,
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexShrink: 0,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', maxWidth: '100%',
    paddingHorizontal: 8, paddingVertical: 3, gap: 5, borderRadius: 12,
  },
  dot: { width: 5, height: 5, borderRadius: 3, flexShrink: 0 },
  pillText: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 15 },
  field: { gap: 8 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  choice: {
    flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.line,
    borderRadius: 9, backgroundColor: colors.surface, minHeight: 40, paddingHorizontal: 10,
  },
  choiceSelected: { backgroundColor: colors.mint, borderColor: '#BBD7C9' },
  choiceText: { fontFamily: fonts.medium, color: colors.muted, fontSize: 12, lineHeight: 17 },
  choiceTextSelected: { color: colors.green, fontFamily: fonts.semibold },
  message: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20, color: colors.red, backgroundColor: colors.redSoft, padding: 10, borderRadius: 9 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  page: { flex: 1, backgroundColor: colors.bg },
  pageInner: { flex: 1, minHeight: 0, width: '100%', maxWidth: 1230, alignSelf: 'center' },
  intro: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 14, gap: 9 },
  introRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12,
  },
  introText: { gap: 4, flexGrow: 1, maxWidth: '100%' },
  introActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  header: { backgroundColor: colors.paper, borderBottomColor: colors.line, borderBottomWidth: 1 },
  headerRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
});
