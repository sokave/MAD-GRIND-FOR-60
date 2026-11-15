import { useEffect, useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ModalFrameProps } from './ModalFrame.types';
import { colors } from './ui';

export function ModalFrame({ title, onClose, sheet, children }: ModalFrameProps) {
  const dialog = useRef<ComponentRef<typeof View>>(null);
  const dismiss = useRef(onClose);
  dismiss.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    const node = dialog.current as unknown as HTMLElement | null;
    node?.focus();

    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss.current();
      }
      if (event.key !== 'Tab' || !node) return;
      const options = Array.from(node.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
      )).filter((item) => item.getClientRects().length > 0);
      const first = options.at(0);
      const last = options.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);

  return (
    <View style={[styles.overlay, sheet && styles.sheetOverlay]}>
      <Pressable
        accessibilityElementsHidden
        focusable={false}
        aria-hidden
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />
      <View
        ref={dialog}
        role="dialog"
        accessibilityLabel={title}
        aria-modal
        tabIndex={-1}
        style={[styles.dialog, sheet && styles.sheet]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
    backgroundColor: 'rgba(19, 41, 34, 0.49)',
  },
  sheetOverlay: { justifyContent: 'flex-end', paddingBottom: 0 },
  dialog: {
    width: '100%', maxWidth: 680, maxHeight: '96%', minHeight: 0,
    backgroundColor: colors.surface, borderRadius: 18, overflow: 'hidden',
  },
  sheet: { maxWidth: 595, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
});
