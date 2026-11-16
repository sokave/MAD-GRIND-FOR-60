import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { rules } from '../../src/game';
import { useGame } from '../../src/GameProvider';
import { Button, Icon, Page, color, theme } from '../../src/ui';

const parameters = [
  ['Час утримання', '3 секунди'],
  ['Бонус за утримання', '+' + rules.holdPoints],
  ['Бонус за швидкий свайп', '+' + rules.swipeMin + '–' + rules.swipeMax],
  ['Бонус за масштабування', '+' + rules.pinchPoints],
  ['Мінімальна зміна масштабу', (rules.pinchThreshold * 100) + '%'],
  ['Ціль рахунку', rules.target + ' очок'],
];

const switchColors = Platform.select({
  web: { activeThumbColor: color.primary },
  ios: { ios_backgroundColor: color.track },
});

export default function SettingsScreen() {
  const { preferences, reset, setEffects, storageMessage } = useGame();
  const [confirm, setConfirm] = useState(false);

  return (
    <Page>
      <Text accessibilityRole="header" style={theme.title}>Налаштування</Text>

      <View style={[theme.card, styles.card]}>
        <View style={styles.cardTitle}>
          <Icon name="options-outline" />
          <Text accessibilityRole="header" style={theme.heading}>Параметри гри</Text>
        </View>
        {parameters.map(([label, value]) => (
          <View key={label} style={styles.parameter}>
            <Text style={theme.body}>{label}</Text>
            <Text style={theme.label}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={[theme.card, styles.card, styles.control]}>
        <View style={styles.controlCopy}>
          <Text accessibilityRole="header" style={theme.heading}>Візуальні ефекти</Text>
          <Text style={theme.body}>Підсвічування жетона після розпізнаного жесту.</Text>
        </View>
        <Switch
          {...switchColors}
          accessibilityLabel="Візуальні ефекти"
          value={preferences.effects}
          onValueChange={setEffects}
          trackColor={{ false: color.track, true: color.accentBorder }}
          thumbColor={preferences.effects ? color.primary : color.muted}
        />
      </View>

      <View style={[theme.card, styles.card]}>
        <Text accessibilityRole="header" style={theme.heading}>Прогрес</Text>
        <Text style={theme.body}>Рахунок і завдання зберігаються на цьому пристрої.</Text>
        {!!storageMessage && <Text accessibilityRole="alert" style={styles.notice}>{storageMessage}</Text>}
        <Button
          title="Скинути прогрес"
          icon="trash-outline"
          variant="danger"
          style={styles.resetButton}
          onPress={() => setConfirm(true)}
        />
      </View>

      <Modal visible={confirm} transparent animationType="fade" onRequestClose={() => setConfirm(false)}>
        <View style={styles.backdrop}>
          <Pressable focusable={false} aria-hidden onPress={() => setConfirm(false)} style={StyleSheet.absoluteFill} />
          <View role="dialog" aria-modal accessibilityLabel="Скинути прогрес?" style={[theme.card, styles.dialog]}>
            <Text accessibilityRole="header" style={theme.heading}>Скинути прогрес?</Text>
            <Text style={theme.body}>Очки й виконані завдання обнуляться.</Text>
            <View style={styles.actions}>
              <Button title="Скасувати" onPress={() => setConfirm(false)} />
              <Button title="Так, скинути" variant="danger" onPress={() => { reset(); setConfirm(false); }} />
            </View>
          </View>
        </View>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: { gap: 9, padding: 14 },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  parameter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 7, borderTopWidth: 1, borderTopColor: color.line, paddingTop: 7 },
  control: { flexDirection: 'row', alignItems: 'center' },
  controlCopy: { flex: 1, gap: 4 },
  resetButton: { alignSelf: 'flex-start' },
  notice: { ...theme.small, color: color.primary },
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: color.backdrop },
  dialog: { width: '100%', maxWidth: 395, padding: 19, gap: 10 },
  actions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' },
});
