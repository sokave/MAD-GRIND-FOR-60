import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, type ListRenderItem } from 'react-native';
import { useAdmin } from '../../../src/admin';
import { userStatus, type PortalUser, type UserStatus } from '../../../src/data';
import { RecordList } from '../../../src/RecordList';
import { Avatar, Button, IconButton, Page, PageIntro, Pill, theme } from '../../../src/ui';

const userRowHeight = 94;

const UserRow = memo(function UserRow({ item, changeStatus }: {
  item: PortalUser; changeStatus: (id: string, status: UserStatus) => void;
}) {
  const active = item.status === 'active';
  const action = active ? 'Заблокувати' : 'Розблокувати';
  return (
    <View style={[theme.card, styles.row]}>
      <Avatar name={item.name} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={theme.strong}>{item.name}</Text>
        <Text numberOfLines={1} style={theme.small}>{item.email}</Text>
        <View style={styles.badges}>
          <Text numberOfLines={1} style={theme.small}>{item.role}</Text>
          <Pill label={userStatus[item.status]} tone={active ? 'green' : 'red'} />
        </View>
      </View>
      <IconButton
        label={action + ' користувача ' + item.name}
        icon={active ? 'lock-closed-outline' : 'lock-open-outline'}
        danger={active}
        onPress={() => changeStatus(item.id, active ? 'blocked' : 'active')}
      />
    </View>
  );
});

export default function UsersScreen() {
  const { records, setUserStatus, userFilters } = useAdmin();
  const router = useRouter();
  const { role, status } = userFilters;
  const items = useMemo(() => records.users.filter((item) => (
    (role === null || item.role === role) && (status === null || item.status === status)
  )), [records.users, role, status]);

  const render = useCallback<ListRenderItem<PortalUser>>(({ item }) => (
    <UserRow item={item} changeStatus={setUserStatus} />
  ), [setUserStatus]);

  return (
    <Page>
      <PageIntro
        title="Користувачі"
        description={'Показано ' + items.length + ' із ' + records.users.length}
        actions={<Button title="Фільтри" label="Фільтри користувачів" icon="options-outline" variant="secondary" onPress={() => router.push('/user-filters')} />}
      >
        {(role || status) && (
          <View style={styles.badges}>
            {role && <Pill label={role} />}
            {status && <Pill label={userStatus[status]} tone={status === 'active' ? 'green' : 'red'} />}
          </View>
        )}
      </PageIntro>
      <RecordList name="user-list" data={items} rowHeight={userRowHeight} renderItem={render} empty="Користувачів за цими фільтрами немає." />
    </Page>
  );
}

const styles = StyleSheet.create({
  row: { height: userRowHeight, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 10 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7 },
});
