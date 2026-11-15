import { Stack, useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from 'expo-router/react-navigation';
import { useWindowDimensions } from 'react-native';
import { WorkspaceHeader, colors, desktopWidth } from '../../../../src/ui';

export const unstable_settings = { anchor: 'index' };

export default function NewsLayout() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.bg },
        header: ({ route, options, back }) => (
          <WorkspaceHeader
            title={options.title ?? 'Новини'}
            onMenu={width < desktopWidth ? () => (
              navigation.dispatch(DrawerActions.toggleDrawer())
            ) : undefined}
            onBack={route.name === '[id]' ? () => {
              if (back) router.back();
              else router.replace('/news');
            } : undefined}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Новини' }} />
      <Stack.Screen name="[id]" options={{ title: 'Деталі новини' }} />
    </Stack>
  );
}
