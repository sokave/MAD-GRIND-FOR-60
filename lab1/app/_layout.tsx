import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProfileProvider } from '../src/profile-context';
export default function RootLayout() {
  return <SafeAreaProvider><ProfileProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /></Stack></ProfileProvider></SafeAreaProvider>;
}
