import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useAdmin } from '../../src/admin';
import { Loading, colors } from '../../src/ui';

export const unstable_settings = { anchor: '(drawer)' };

const webOverlay = Platform.OS === 'web';
const editOptions = {
  presentation: webOverlay ? 'transparentModal' as const : 'modal' as const,
  contentStyle: { backgroundColor: webOverlay ? 'transparent' : colors.bg },
  animation: webOverlay ? 'none' as const : undefined,
};
const filterOptions = {
  presentation: webOverlay ? 'transparentModal' as const : 'formSheet' as const,
  sheetAllowedDetents: [0.6, 0.9, 1],
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  sheetCornerRadius: 24,
  contentStyle: { backgroundColor: webOverlay ? 'transparent' : colors.surface },
  animation: webOverlay ? 'none' as const : undefined,
};

export default function AdminLayout() {
  const { ready, isAuthenticated } = useAdmin();
  if (!ready) return <Loading />;
  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="news-editor" options={editOptions} />
      <Stack.Screen name="news-filters" options={filterOptions} />
      <Stack.Screen name="user-filters" options={filterOptions} />
    </Stack>
  );
}
