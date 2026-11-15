import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ModalFrameProps } from './ModalFrame.types';
import { colors, theme } from './ui';

export function ModalFrame({ sheet, children }: ModalFrameProps) {
  const edges = sheet ? ['left', 'right', 'bottom'] as const : ['top', 'left', 'right', 'bottom'] as const;
  return (
    <SafeAreaView edges={edges} style={[theme.fill, styles.surface]}>
      <KeyboardAvoidingView
        style={theme.fill}
        behavior={!sheet && Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ surface: { backgroundColor: colors.surface } });
