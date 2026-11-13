import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../src/ui';
export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.blue, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: 'white', borderTopColor: colors.border }, tabBarLabelStyle: { fontSize: 12, fontWeight: '600' } }}>
    <Tabs.Screen name="index" options={{ title: 'Головна', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={typeof color === 'string' ? color : colors.muted} size={size} /> }} />
    <Tabs.Screen name="gallery" options={{ title: 'Галерея', tabBarIcon: ({ color, size }) => <Ionicons name="images" color={typeof color === 'string' ? color : colors.muted} size={size} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Профіль', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={typeof color === 'string' ? color : colors.muted} size={size} /> }} />
  </Tabs>;
}


