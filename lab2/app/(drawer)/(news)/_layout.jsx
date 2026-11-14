import { Stack } from 'expo-router';
import { colors } from '../../../src/theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function NewsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
