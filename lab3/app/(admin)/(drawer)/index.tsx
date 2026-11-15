import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAdmin } from '../../../src/admin';
import { AuditRow } from '../../../src/AuditRow';
import { type Records } from '../../../src/data';
import {
  Button, Icon, Message, Page, colors, fonts, theme, type IconName,
} from '../../../src/ui';

function summarize(records: Records) {
  return {
    news: records.news.length,
    published: records.news.filter((item) => item.status === 'published').length,
    draft: records.news.filter((item) => item.status === 'draft').length,
    review: records.news.filter((item) => item.status === 'review').length,
    users: records.users.length,
    active: records.users.filter((item) => item.status === 'active').length,
    logs: records.logs.length,
    recent: records.logs.slice(0, 4),
  };
}

export default function DashboardScreen() {
  const { records, storageMessage } = useAdmin();
  const [overview, setOverview] = useState(() => summarize(records));
  const { width } = useWindowDimensions();
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    setOverview(summarize(records));
  }, [records]));

  const stats: { label: string; value: number; hint: string; icon: IconName; color: string; background: string }[] = [
    { label: 'Новини', value: overview.news, hint: 'Опубліковано · ' + overview.published,
      icon: 'newspaper-outline', color: colors.green, background: colors.mint },
    { label: 'Користувачі', value: overview.users, hint: 'Активні · ' + overview.active,
      icon: 'people-outline', color: colors.clay, background: colors.claySoft },
    { label: 'Системні логи', value: overview.logs, hint: 'Записів у журналі',
      icon: 'list-outline', color: colors.violet, background: colors.violetSoft },
  ];
  const workflow = [
    { label: 'Опубліковано', count: overview.published, color: '#347661' },
    { label: 'Чернетки', count: overview.draft, color: '#C09879' },
    { label: 'На перевірці', count: overview.review, color: '#AE8E48' },
  ];

  return (
    <Page>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text accessibilityRole="header" style={styles.heroTitle}>Дашборд редакції</Text>
            <Text style={styles.heroBody}>Стан новин, облікових записів і останні дії.</Text>
          </View>
          <Button
            title="Нова новина"
            icon="add"
            variant="secondary"
            onPress={() => router.push('/news-editor')}
          />
        </View>

        {!!storageMessage && <Message>{storageMessage}</Message>}
        <View style={[styles.stats, width < 760 && styles.statsNarrow]}>
          {stats.map((stat) => (
            <View key={stat.label} style={[theme.card, styles.stat]}>
              <View style={[styles.statIcon, { backgroundColor: stat.background }]}>
                <Icon name={stat.icon} size={21} color={stat.color} />
              </View>
              <View style={styles.statCopy}>
                <Text style={theme.small}>{stat.label}</Text>
                <Text accessibilityLabel={stat.label + ': ' + stat.value} style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statHint}>{stat.hint}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.lower, width < 1030 && styles.lowerNarrow]}>
          <View style={[theme.card, styles.workflow]}>
            <Text accessibilityRole="header" style={theme.subhead}>Статуси новин</Text>
            <View style={styles.bar} accessible accessibilityLabel={workflow.map((item) => item.label + ' ' + item.count).join(', ')}>
              {workflow.filter((item) => item.count).map((item) => (
                <View key={item.label} style={{ flex: item.count, backgroundColor: item.color }} />
              ))}
            </View>
            <View style={styles.legend}>
              {workflow.map((item) => (
                <View key={item.label} style={styles.legendRow}>
                  <View style={[styles.key, { backgroundColor: item.color }]} />
                  <Text style={[theme.body, styles.legendLabel]}>{item.label}</Text>
                  <Text style={theme.strong}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[theme.card, styles.activity]}>
            <View style={styles.activityHeader}>
              <Text accessibilityRole="header" style={theme.subhead}>Останні дії</Text>
              <Button title="Увесь журнал" variant="secondary" onPress={() => router.navigate('/logs')} />
            </View>
            {overview.recent.map((entry) => <AuditRow key={entry.id} entry={entry} compact />)}
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 30 },
  hero: {
    backgroundColor: colors.greenDeep, padding: 22, borderRadius: 16, minHeight: 140,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14,
  },
  heroCopy: { gap: 8, flexGrow: 1, flexShrink: 1 },
  heroTitle: { color: colors.surface, fontFamily: fonts.display, fontSize: 31, lineHeight: 39, letterSpacing: -0.7 },
  heroBody: { color: '#D7EBE1', fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: 12 },
  statsNarrow: { flexDirection: 'column' },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 11, minHeight: 103, minWidth: 0 },
  statIcon: { width: 43, height: 43, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statCopy: { flex: 1, gap: 2, minWidth: 0 },
  statValue: { fontFamily: fonts.display, color: colors.ink, fontSize: 27, lineHeight: 32 },
  statHint: { ...theme.small, fontSize: 11 },
  lower: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  lowerNarrow: { flexDirection: 'column', alignItems: 'stretch' },
  workflow: { flexGrow: 2, flexBasis: 280, flexShrink: 1, padding: 16, gap: 14, alignSelf: 'stretch' },
  bar: { height: 11, flexDirection: 'row', backgroundColor: colors.bg, borderRadius: 6, overflow: 'hidden' },
  legend: { gap: 9 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  key: { width: 9, height: 9, borderRadius: 3 },
  legendLabel: { flex: 1 },
  activity: { flexGrow: 3, flexBasis: 360, flexShrink: 1, minWidth: 0, paddingHorizontal: 6, paddingBottom: 5 },
  activityHeader: {
    paddingHorizontal: 10, paddingTop: 12, gap: 7, paddingBottom: 6,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
  },
});
