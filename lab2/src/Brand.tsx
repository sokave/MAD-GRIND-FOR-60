import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from './theme';

export function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.mark}>
        <Ionicons name="school-outline" size={20} color={colors.surface} />
      </View>
      <Text style={styles.name}>Кампус</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  name: {
    color: colors.navy,
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
});
