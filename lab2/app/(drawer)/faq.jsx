import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, pageWidth, shared } from '../../src/theme';

/**
 * @typedef {{id: string, question: string, answer: string}} FaqItem
 * @typedef {{key: string, title: string, icon: import('react').ComponentProps<typeof Ionicons>['name'], data: FaqItem[]}} FaqSection
 */

/** @type {FaqSection[]} */
const sections = [
  {
    key: 'account',
    title: 'Обліковий запис',
    icon: 'person-circle-outline',
    data: [
      {
        id: 'sign-in',
        question: 'Як увійти до застосунку?',
        answer: 'Введи пошту student@example.com і пароль lab2demo на екрані входу. Після перевірки даних відкриється стрічка.',
      },
      {
        id: 'sign-out',
        question: 'Як завершити сеанс?',
        answer: 'Відкрий бічне меню й натисни «Вийти». Застосунок поверне тебе на екран входу.',
      },
    ],
  },
  {
    key: 'news',
    title: 'Новини',
    icon: 'newspaper-outline',
    data: [
      {
        id: 'refresh',
        question: 'Як оновити стрічку новин?',
        answer: 'На телефоні потягни стрічку вниз від початку списку. У браузері натисни кнопку оновлення біля заголовка. Стрічка повернеться до першої порції новин.',
      },
      {
        id: 'more',
        question: 'Як завантажити більше новин?',
        answer: 'Прокрути стрічку донизу. Коли наблизишся до кінця, застосунок автоматично додасть наступну порцію матеріалів.',
      },
      {
        id: 'detail',
        question: 'Як прочитати повний текст новини?',
        answer: 'Натисни картку новини, щоб відкрити повний текст. Кнопка «До новин» поверне тебе до стрічки.',
      },
    ],
  },
  {
    key: 'app',
    title: 'Про застосунок',
    icon: 'information-circle-outline',
    data: [
      {
        id: 'offline',
        question: 'Чи працює стрічка без інтернету?',
        answer: 'Застосунок читає новини з локального набору даних. Під час розробки Expo Go потребує з’єднання із сервером Metro, щоб завантажити застосунок.',
      },
      {
        id: 'data',
        question: 'Звідки беруться новини?',
        answer: 'Тексти підготовлені для демонстрації стрічки, а частину матеріалів ілюструють фотографії з сайту новин Житомирської політехніки.',
      },
    ],
  },
];

export default function FaqScreen() {
  const [expanded, setExpanded] = useState(/** @type {string | null} */ (null));

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={shared.safeArea}>
      <SectionList
        style={styles.page}
        contentContainerStyle={styles.content}
        sections={sections}
        extraData={expanded}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text accessibilityRole="header" style={shared.pageHeading}>Довідковий центр</Text>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.section}>
            <Ionicons name={section.icon} size={20} color={colors.blue} />
            <Text accessibilityRole="header" style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const open = item.id === expanded;

          return (
            <View style={styles.item}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.question}
                aria-expanded={open}
                onPress={() => setExpanded((current) => current === item.id ? null : item.id)}
                style={({ pressed }) => [styles.questionRow, pressed && shared.pressed]}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons name={open ? 'remove' : 'add'} size={20} color={colors.blue} />
              </Pressable>
              {open && <Text style={styles.answer}>{item.answer}</Text>}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: pageWidth,
    alignSelf: 'center',
  },
  content: {
    padding: 18,
    paddingTop: 20,
    paddingBottom: 28,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 9,
  },
  sectionTitle: {
    color: colors.navy,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 23,
  },
  item: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    backgroundColor: colors.surface,
    marginBottom: 7,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 49,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  question: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  answer: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingBottom: 13,
  },
});
