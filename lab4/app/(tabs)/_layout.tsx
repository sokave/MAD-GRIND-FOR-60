import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Icon, color, font } from '../../src/ui';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.muted,
        tabBarStyle: {
          backgroundColor: color.card,
          borderTopColor: color.line,
          height: 63 + bottom,
          paddingTop: 4,
          paddingBottom: 5 + bottom,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontFamily: font.bold, fontSize: 12, lineHeight: 17 },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Гра',
        tabBarIcon: ({ color: tint }) => <Icon name="game-controller-outline" size={22} tint={typeof tint === 'string' ? tint : color.primary} />,
      }} />
      <Tabs.Screen name="tasks" options={{
        title: 'Завдання',
        tabBarIcon: ({ color: tint }) => <Icon name="checkbox-outline" size={21} tint={typeof tint === 'string' ? tint : color.primary} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Налаштування',
        tabBarIcon: ({ color: tint }) => <Icon name="settings-outline" size={21} tint={typeof tint === 'string' ? tint : color.primary} />,
      }} />
    </Tabs>
  );
}
