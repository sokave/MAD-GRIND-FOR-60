import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Rubik_600SemiBold } from '@expo-google-fonts/rubik/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, Slot, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from '../src/GameProvider';
import { color, theme } from '../src/ui';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: color.primary,
    background: color.bg,
    card: color.card,
    text: color.ink,
    border: color.line,
    notification: color.primary,
  },
};

function Loading() {
  return (
    <View style={[theme.fill, styles.center]}>
      <ActivityIndicator size="large" color={color.primary} accessibilityLabel="Завантаження" />
    </View>
  );
}

function Screens() {
  const { ready } = useGame();
  return ready ? <Slot /> : <Loading />;
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold, Rubik_600SemiBold });
  return (
    <GestureHandlerRootView style={theme.fill}>
      <SafeAreaProvider>
        <GameProvider>
          <ThemeProvider value={navigationTheme}>
            <StatusBar style="light" />
            {loaded || fontError ? <Screens /> : <Loading />}
          </ThemeProvider>
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', justifyContent: 'center' } });
