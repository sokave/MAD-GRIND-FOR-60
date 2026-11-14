import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { Drawer, DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/auth';
import { Brand } from '../../src/Brand';
import { colors, fonts, shared } from '../../src/theme';

export const unstable_settings = {
  initialRouteName: '(news)',
};

/** @param {import('expo-router/drawer').DrawerHeaderProps} props */
function Header({ navigation, options }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Відкрити меню"
          onPress={() => navigation.toggleDrawer()}
          style={({ pressed }) => [styles.iconButton, pressed && shared.pressed]}
        >
          <Ionicons name="menu-outline" size={23} color={colors.navy} />
        </Pressable>
        <Brand />
        <Text numberOfLines={1} style={styles.headerLabel}>{options.title}</Text>
      </View>
    </SafeAreaView>
  );
}

/** @param {import('expo-router/drawer').DrawerContentComponentProps & { onLogout: () => void }} props */
function Menu({ onLogout, ...props }) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.menu}>
      <View style={styles.menuTop}>
        <Brand />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Закрити меню"
          onPress={() => props.navigation.closeDrawer()}
          style={({ pressed }) => [styles.iconButton, pressed && shared.pressed]}
        >
          <Ionicons name="close-outline" size={22} color={colors.navy} />
        </Pressable>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.menuBottom}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Вийти"
          onPress={onLogout}
          style={({ pressed }) => [styles.logout, pressed && shared.pressed]}
        >
          <Ionicons name="log-out-outline" size={21} color={colors.red} />
          <Text style={styles.logoutText}>Вийти</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <Menu {...props} onLogout={logout} />}
      screenOptions={{
        header: (props) => <Header {...props} />,
        drawerType: 'front',
        drawerStyle: { backgroundColor: colors.surface, width: 286 },
        drawerActiveBackgroundColor: colors.blueLight,
        drawerActiveTintColor: colors.blue,
        drawerInactiveTintColor: colors.navy,
        drawerItemStyle: { marginHorizontal: 16, borderRadius: 10 },
        drawerLabelStyle: { fontFamily: fonts.semibold, fontSize: 14 },
        overlayColor: 'rgba(16, 31, 59, 0.42)',
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="(news)"
        options={{
          title: 'Новини',
          popToTopOnBlur: true,
          drawerIcon: ({ color, size }) => (
            <Ionicons aria-hidden name="newspaper-outline" color={typeof color === 'string' ? color : colors.navy} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="faq"
        options={{
          title: 'Довідка',
          drawerIcon: ({ color, size }) => (
            <Ionicons aria-hidden name="help-circle-outline" color={typeof color === 'string' ? color : colors.navy} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerRow: {
    width: '100%',
    maxWidth: 1120,
    minHeight: 64,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#F2F5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    flex: 1,
    textAlign: 'right',
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  menu: {
    flexGrow: 1,
  },
  menuTop: {
    padding: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuBottom: {
    marginTop: 'auto',
    padding: 16,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.redLight,
  },
  logoutText: {
    color: colors.red,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
});
