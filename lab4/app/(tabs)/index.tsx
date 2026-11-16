import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Arena } from '../../src/Arena';
import { getGoals, gestureLabels, rules } from '../../src/game';
import { useGame } from '../../src/GameProvider';
import { Button, Icon, ProgressBar, color, font, theme, type IconName } from '../../src/ui';

const help: { label: string; reward: string; icon: IconName }[] = [
  { label: 'Один дотик', reward: '+1', icon: 'finger-print-outline' },
  { label: 'Подвійний дотик', reward: '+2', icon: 'copy-outline' },
  { label: 'Утримання 3 с', reward: '+5', icon: 'timer-outline' },
  { label: 'Перетягування', reward: 'Рух', icon: 'move-outline' },
  { label: 'Швидкий свайп', reward: '+3–9', icon: 'swap-horizontal-outline' },
  { label: 'Масштаб двома пальцями', reward: '+4', icon: 'resize-outline' },
];

function ScoreCard({ compact }: { compact: boolean }) {
  const { progress } = useGame();
  return (
    <View style={[theme.card, styles.scoreCard, compact && styles.scoreCompact]}>
      <View style={styles.scoreMain}>
        <View style={styles.scoreIcon}><Icon name="flash" tint={color.onPrimary} size={22} /></View>
        <View>
          <Text style={theme.small}>Твій рахунок</Text>
          <Text
            accessibilityLabel={'Очки ' + progress.score}
            accessibilityLiveRegion="polite"
            testID="score"
            style={styles.score}
          >{progress.score}</Text>
        </View>
      </View>
      <View style={[styles.scoreGoal, compact && styles.scoreGoalCompact]}>
        <View style={styles.goalLabels}>
          <Text style={theme.small}>Ціль</Text>
          <Text style={theme.small}>{Math.min(progress.score, rules.target)} / {rules.target}</Text>
        </View>
        <ProgressBar value={progress.score} max={rules.target} />
      </View>
    </View>
  );
}

function GestureGuide() {
  return (
    <View style={[theme.card, styles.guide]}>
      <Text accessibilityRole="header" style={theme.heading}>Жести й очки</Text>
      {help.map((item) => (
        <View key={item.label} style={styles.guideRow}>
          <Icon name={item.icon} size={18} />
          <Text style={[theme.body, styles.guideLabel]}>{item.label}</Text>
          <Text style={styles.guideReward}>{item.reward}</Text>
        </View>
      ))}
    </View>
  );
}

export default function GameScreen() {
  const { progress, last, generation, storageMessage } = useGame();
  const { width, height, fontScale } = useWindowDimensions();
  const router = useRouter();
  const wide = width >= 870;
  const scroll = height < 610 || fontScale > 1.25;
  const goals = getGoals(progress);
  const done = goals.filter((goal) => goal.done).length;

  const page = (
    <View style={[styles.page, !scroll && styles.pageFill]}>
      <View style={styles.intro}>
        <View style={styles.introText}>
          <Text accessibilityRole="header" style={theme.title}>Ігрове поле</Text>
          <Text style={theme.body}>Починай кожен жест на жетоні.</Text>
        </View>
        <Button
          title={done + ' з ' + goals.length}
          icon="checkbox-outline"
          label={'Завдання, виконано ' + done + ' з ' + goals.length}
          onPress={() => router.navigate('/tasks')}
        />
      </View>

      {!!storageMessage && <Text accessibilityRole="alert" style={styles.notice}>{storageMessage}</Text>}

      <View style={[styles.columns, wide && styles.columnsWide, !scroll && styles.pageFill]}>
        {!wide && <ScoreCard compact />}
        <View style={[styles.play, !scroll && styles.pageFill]}>
          <Arena key={generation} generation={generation} />
          <View style={[theme.card, styles.feedback]}>
            <View style={styles.feedbackIcon}><Icon name={last?.combo ? 'trophy-outline' : 'pulse-outline'} size={20} /></View>
            <View style={styles.feedbackCopy}>
              <Text style={theme.small}>{last?.combo ? 'Комбінацію виконано' : 'Останній жест'}</Text>
              <Text style={theme.label} accessibilityLiveRegion="polite" testID="last-gesture">
                {last ? gestureLabels[last.gesture] : 'Ще немає жестів'}
              </Text>
            </View>
            {!!last?.points && <Text style={styles.gain} testID="last-points">+{last.points}</Text>}
          </View>
        </View>
        {wide && (
          <View style={styles.aside}>
            <ScoreCard compact={false} />
            <GestureGuide />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.fill}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{page}</ScrollView> : page}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 1170, alignSelf: 'center', padding: 17, gap: 12 },
  pageFill: { flex: 1, minHeight: 0 },
  intro: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  introText: { minWidth: 0, flexGrow: 1, gap: 3 },
  columns: { gap: 11 },
  columnsWide: { flexDirection: 'row', alignItems: 'stretch', gap: 15 },
  play: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 9 },
  aside: { width: 320, gap: 11 },
  scoreCard: { padding: 14, gap: 12 },
  scoreCompact: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 11 },
  scoreMain: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreIcon: { width: 41, height: 41, borderRadius: 11, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center' },
  score: { fontFamily: font.display, fontSize: 30, lineHeight: 34, color: color.ink },
  scoreGoal: { gap: 5 },
  scoreGoalCompact: { flex: 1, maxWidth: 153 },
  goalLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  guide: { padding: 14, gap: 13 },
  guideRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  guideLabel: { flex: 1 },
  guideReward: { fontFamily: font.bold, fontSize: 12, color: color.primary },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 9 },
  feedbackCopy: { flex: 1, minWidth: 0 },
  feedbackIcon: { width: 37, height: 37, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: color.accentSoft },
  gain: { backgroundColor: color.primary, color: color.onPrimary, fontFamily: font.bold, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  notice: { ...theme.small, color: color.primary },
});
