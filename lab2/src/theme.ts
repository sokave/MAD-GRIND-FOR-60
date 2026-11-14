import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  navy: '#142440',
  text: '#17243A',
  muted: '#526278',
  line: '#DFE6F0',
  blue: '#244DBB',
  blueLight: '#EDF2FF',
  red: '#A42638',
  redLight: '#FEF0F2',
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heading: 'Rubik_500Medium',
  display: 'Rubik_600SemiBold',
};

export const pageWidth = 860;

export const shared = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageHeading: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  body: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  eyebrow: {
    color: colors.blue,
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.25,
  },
  pressed: {
    opacity: 0.75,
  },
});
