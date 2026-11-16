import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { entryName, errorText } from './files';
import type { Kind } from './files';
import { Button, Notice, color, font, ui } from './ui';

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.shade} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable aria-hidden focusable={false} style={StyleSheet.absoluteFill} onPress={onClose} />
        <View role="dialog" aria-modal accessibilityLabel={title} style={[ui.card, styles.dialog]}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.dialogContent}>
            <Text accessibilityRole="header" style={ui.heading}>{title}</Text>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type FormProps = { onClose: () => void } & (
  { kind: Kind; submit: (name: string, text: string) => Promise<void> }
  | { kind: 'edit'; fileName: string; initial: string; submit: (text: string) => Promise<void> }
);

export function EntryForm(props: FormProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState(props.kind === 'edit' ? props.initial : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const editing = props.kind === 'edit';
  const title = props.kind === 'folder' ? 'Нова папка' : editing ? 'Редагувати файл' : 'Новий текстовий файл';

  async function save() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setError('');
    try {
      if (props.kind === 'edit') await props.submit(text);
      else await props.submit(entryName(name, props.kind), text);
      props.onClose();
    } catch (failure) {
      setError(errorText(failure, 'Не вдалося зберегти. Спробуй ще раз.'));
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog title={title} onClose={() => { if (!inFlight.current) props.onClose(); }}>
      {props.kind === 'edit' ? <Text style={ui.caption}>{props.fileName}</Text> : (
        <View style={styles.field}>
          <Text style={ui.label}>Назва</Text>
          <TextInput
            accessibilityLabel="Назва"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!saving}
            value={name}
            onChangeText={setName}
            placeholder={props.kind === 'folder' ? 'Наприклад, Навчання' : 'Наприклад, Нотатки'}
            placeholderTextColor={color.muted}
            selectionColor={color.accent}
            style={styles.input}
          />
          {props.kind === 'file' && <Text style={ui.caption}>Розширення .txt додасться автоматично.</Text>}
        </View>
      )}
      {props.kind !== 'folder' && (
        <View style={styles.field}>
          <Text style={ui.label}>Вміст</Text>
          <TextInput
            accessibilityLabel="Вміст"
            multiline
            editable={!saving}
            value={text}
            onChangeText={setText}
            placeholder="Введи текст…"
            placeholderTextColor={color.muted}
            selectionColor={color.accent}
            style={[styles.input, styles.multiline]}
          />
        </View>
      )}
      {error ? <Notice>{error}</Notice> : null}
      <View style={dialogActions.row}>
        <Button label="Скасувати" outline onPress={props.onClose} disabled={saving} style={dialogActions.button} />
        <Button label={saving ? 'Збереження…' : editing ? 'Зберегти' : 'Створити'} onPress={save} disabled={saving} style={dialogActions.button} />
      </View>
    </Dialog>
  );
}

export const dialogActions = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginTop: 2 },
  button: { flex: 1 },
});

const styles = StyleSheet.create({
  shade: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.shade, padding: 18 },
  dialog: { width: '100%', maxWidth: 450, maxHeight: '100%', overflow: 'hidden' },
  dialogContent: { gap: 13, padding: 17 },
  field: { gap: 6 },
  input: { minHeight: 46, paddingHorizontal: 11, paddingVertical: 10, borderRadius: 9, borderWidth: 1, borderColor: color.line, backgroundColor: color.background, color: color.text, fontFamily: font.normal, fontSize: 15 },
  multiline: { minHeight: 135, textAlignVertical: 'top', lineHeight: 23 },
});
