import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { getGoals } from '../../src/game';
import { useGame } from '../../src/GameProvider';
import { Icon, Page, ProgressBar, color, font, theme } from '../../src/ui';

export default function TasksScreen() {
  const { progress } = useGame();
  const { width } = useWindowDimensions();
  const goals = getGoals(progress);
  const done = goals.filter((goal) => goal.done).length;

  return (
    <Page>
      <View style={styles.intro}>
        <Text accessibilityRole="header" style={theme.title}>Завдання</Text>
        <Text style={theme.body}>Виконано {done} з {goals.length}</Text>
        <ProgressBar value={done} max={goals.length} />
      </View>

      <View style={[styles.list, width >= 700 && styles.twoColumns]}>
        {goals.map((goal) => (
          <View
            key={goal.id}
            testID={'goal-' + goal.id}
            style={[theme.card, styles.row, width >= 700 && styles.tile]}
          >
            <View style={[styles.icon, goal.done && styles.iconDone]}>
              <Icon name={goal.done ? 'checkmark' : goal.icon} tint={goal.done ? color.onPrimary : color.primary} size={19} />
            </View>
            <View style={styles.copy}>
              <View style={styles.rowTitle}>
                <Text accessibilityRole="header" style={theme.label}>{goal.title}</Text>
                <Text style={[styles.badge, goal.done ? styles.done : styles.ongoing]}>{goal.done ? 'Виконано' : 'У процесі'}</Text>
              </View>
              <Text style={theme.small}>{goal.description}</Text>
              <View style={styles.meter}>
                <View style={styles.bar}><ProgressBar value={goal.current} max={goal.target} /></View>
                <Text style={theme.small}>{goal.current} / {goal.target}</Text>
              </View>
              {goal.id === 'swipe' && (
                <Text style={theme.small}>
                  {progress.counts.left > 0 ? '✓' : '○'} Ліворуч   {progress.counts.right > 0 ? '✓' : '○'} Праворуч
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 7 },
  list: { gap: 9 },
  twoColumns: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 12 },
  tile: { width: '49.3%' },
  icon: { width: 36, height: 36, borderRadius: 9, backgroundColor: color.accentSoft, justifyContent: 'center', alignItems: 'center' },
  iconDone: { backgroundColor: color.primary },
  copy: { flex: 1, minWidth: 0, gap: 6 },
  rowTitle: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 5 },
  badge: { fontFamily: font.bold, borderRadius: 7, fontSize: 10, lineHeight: 16, paddingHorizontal: 6 },
  ongoing: { backgroundColor: color.raised, color: color.muted },
  done: { backgroundColor: color.accentSoft, color: color.primary },
  meter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bar: { flex: 1 },
});
