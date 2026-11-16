import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { color, ui } from '../ui';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: color.accent,
    background: color.background,
    card: color.panel,
    text: color.text,
    border: color.line,
    notification: color.accent,
  },
};

export default function RootLayout() {
  const [loaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold });
  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        {loaded || fontError ? (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }}>
            <Stack.Screen name="index" options={{ title: 'Файловий менеджер' }} />
            <Stack.Screen name="file" options={{ title: 'Файл' }} />
          </Stack>
        ) : <View style={[ui.screen, styles.loading]}><ActivityIndicator color={color.accent} /></View>}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ loading: { justifyContent: 'center' } });
