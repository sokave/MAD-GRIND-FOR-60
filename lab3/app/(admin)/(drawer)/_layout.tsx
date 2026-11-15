import { Drawer, DrawerContentScrollView, type DrawerContentComponentProps } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAdmin } from '../../../src/admin';
import { adminAccount } from '../../../src/data';
import {
  Avatar, Brand, Button, Icon, IconButton, WorkspaceHeader, colors, desktopWidth, fonts, theme,
  type IconName,
} from '../../../src/ui';

export const unstable_settings = { initialRouteName: 'index' };

const destinations: Record<string, { title: string; icon: IconName }> = {
  index: { title: 'Дашборд', icon: 'grid-outline' },
  news: { title: 'Новини', icon: 'newspaper-outline' },
  users: { title: 'Користувачі', icon: 'people-outline' },
  logs: { title: 'Системні логи', icon: 'list-outline' },
};

function AdminDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const { logout } = useAdmin();
  const { width } = useWindowDimensions();
  const compact = width < desktopWidth;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <Brand />
        {compact && <IconButton label="Закрити меню" icon="close-outline" onPress={() => navigation.closeDrawer()} />}
      </View>
      <View style={styles.items}>
        {state.routes.map((route, index) => {
          const destination = destinations[route.name];
          if (!destination) return null;
          const selected = index === state.index;
          const tint = selected ? colors.green : colors.muted;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={destination.title}
              accessibilityState={{ selected }}
              onPress={() => {
                if (selected) navigation.closeDrawer();
                else navigation.navigate(route.name);
              }}
              style={({ pressed }) => [styles.item, selected && styles.selected, pressed && theme.pressed]}
            >
              <Icon name={destination.icon} size={20} color={tint} />
              <Text style={[styles.itemText, { color: tint }]}>{destination.title}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.bottom}>
        <View style={styles.profile}>
          <Avatar name={adminAccount.name} admin />
          <View style={styles.profileText}>
            <Text numberOfLines={1} style={theme.strong}>{adminAccount.name}</Text>
            <Text numberOfLines={1} style={theme.small}>{adminAccount.email}</Text>
          </View>
        </View>
        <Button title="Вийти" icon="log-out-outline" variant="secondary" onPress={logout} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { width } = useWindowDimensions();
  const compact = width < desktopWidth;

  return (
    <Drawer
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        drawerType: compact ? 'front' : 'permanent',
        drawerStyle: { width: 256, backgroundColor: colors.paper, borderRightColor: colors.line, borderRightWidth: 1 },
        overlayColor: 'rgba(20, 43, 35, 0.46)',
        sceneStyle: { backgroundColor: colors.bg },
        header: ({ options, navigation }) => (
          <WorkspaceHeader
            title={options.title ?? 'Редакція'}
            onMenu={compact ? () => navigation.toggleDrawer() : undefined}
          />
        ),
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Дашборд' }} />
      <Drawer.Screen name="news" options={{ title: 'Новини', headerShown: false, popToTopOnBlur: true }} />
      <Drawer.Screen name="users" options={{ title: 'Користувачі' }} />
      <Drawer.Screen name="logs" options={{ title: 'Системні логи' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 0 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 18, paddingVertical: 23 },
  items: { paddingHorizontal: 14, gap: 5 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 46, paddingHorizontal: 12, borderRadius: 9 },
  selected: { backgroundColor: colors.mint },
  itemText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  bottom: { marginTop: 'auto', borderTopColor: colors.line, borderTopWidth: 1, marginHorizontal: 15, paddingVertical: 16, gap: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileText: { flex: 1, minWidth: 0, gap: 2 },
});
