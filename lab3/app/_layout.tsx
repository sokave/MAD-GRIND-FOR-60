import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Rubik_500Medium } from '@expo-google-fonts/rubik/500Medium';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AdminProvider } from '../src/admin';
import { colors, Loading, theme } from '../src/ui';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Rubik_500Medium,
  });

  if (!fontsLoaded && !fontError) return <Loading />;

  return (
    <GestureHandlerRootView style={theme.fill}>
      <SafeAreaProvider>
        <AdminProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </AdminProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
