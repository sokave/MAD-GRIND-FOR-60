import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auditLabels, logDateLabel, type AuditAction, type AuditEntry } from './data';
import { Icon, colors, theme, type IconName } from './ui';

const kind: Record<AuditAction, { icon: IconName; color: string; background: string }> = {
  login: { icon: 'log-in-outline', color: colors.green, background: colors.mint },
  logout: { icon: 'log-out-outline', color: colors.violet, background: colors.violetSoft },
  createNews: { icon: 'add-circle-outline', color: colors.green, background: colors.mint },
  editNews: { icon: 'create-outline', color: colors.gold, background: colors.goldSoft },
  deleteNews: { icon: 'trash-outline', color: colors.red, background: colors.redSoft },
  changeUserStatus: { icon: 'people-outline', color: colors.violet, background: colors.violetSoft },
};

export const auditRowHeight = 76;

export const AuditRow = memo(function AuditRow({
  entry, compact,
}: { entry: AuditEntry; compact?: boolean }) {
  const event = kind[entry.action];

  return (
    <View style={[styles.row, !compact && theme.card]}>
      <View style={[styles.symbol, { backgroundColor: event.background }]}>
        <Icon name={event.icon} size={19} color={event.color} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={2} style={theme.strong}>{auditLabels[entry.action]}</Text>
        <Text numberOfLines={2} style={theme.small}>{entry.detail}</Text>
      </View>
      <View style={styles.meta}>
        <Text numberOfLines={1} style={theme.small}>{logDateLabel.format(new Date(entry.createdAt))}</Text>
        {!compact && <Text numberOfLines={1} style={styles.actor}>{entry.actor}</Text>}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: auditRowHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 9,
  },
  symbol: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  meta: { alignItems: 'flex-end', gap: 3, maxWidth: '34%' },
  actor: { ...theme.small, fontSize: 10 },
});
