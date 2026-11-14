import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';

type Category = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  ink: string;
  background: string;
};

export const categories = {
  events: { label: 'Події', icon: 'calendar-outline', ink: '#224FB1', background: '#E8F0FF' },
  study: { label: 'Навчання', icon: 'book-outline', ink: '#4B398E', background: '#F0EBFF' },
  research: { label: 'Наука', icon: 'flask-outline', ink: '#126565', background: '#E3F5F1' },
  opportunities: { label: 'Можливості', icon: 'compass-outline', ink: '#8A4F0B', background: '#FFF0D9' },
  community: { label: 'Спільнота', icon: 'people-outline', ink: '#90405E', background: '#FCEAF1' },
  international: { label: 'Співпраця', icon: 'globe-outline', ink: '#175E43', background: '#E4F4EB' },
} satisfies Record<string, Category>;

type ArticleContent = {
  category: keyof typeof categories;
  title: string;
  summary: string;
  paragraphs: string[];
  image?: ImageSourcePropType;
};

export type Article = ArticleContent & {
  id: string;
  date: string;
};

export const campusPhoto: ImageSourcePropType = require('../assets/student-team.png');

const highlights: ArticleContent[] = [
  {
    category: 'events',
    title: 'Студенти зустрілися з командою проєкту з кібербезпеки',
    summary: 'Учасники обговорили практичне навчання та ідеї для спільних студентських проєктів.',
    paragraphs: [
      'Зустріч почалася з розмови про те, як університетські команди можуть працювати над спільними навчальними завданнями. Студенти розповіли, які навички хочуть відпрацювати під час командної роботи.',
      'Учасники запропонували проводити короткі практичні сесії, на яких можна розібрати приклади, обговорити рішення та отримати відгук від викладачів.',
      'Після зустрічі учасники зібрали пропозиції щодо наступних тем і домовилися обговорити їх у своїх навчальних групах.',
    ],
    image: campusPhoto,
  },
  {
    category: 'international',
    title: 'Університети обговорили нові формати студентського обміну',
    summary: 'Серед пропозицій були спільні онлайн-заняття та короткі командні проєкти.',
    paragraphs: [
      'Під час зустрічі учасники обговорили, як студенти різних університетів можуть працювати над одним завданням і презентувати результати англійською.',
      'Команди запропонували поєднувати онлайн-зустрічі з самостійною роботою. Для початку учасники зберуть теми, які підходять студентам різних спеціальностей.',
    ],
    image: require('../assets/university-campus.png'),
  },
  {
    category: 'study',
    title: 'Відкрита зустріч про навчання в університетах-партнерах',
    summary: 'Студенти обговорили підготовку до навчального обміну та роботу в міжнародних командах.',
    paragraphs: [
      'На зустрічі обговорили, як обрати навчальні дисципліни за кордоном, погодити їх зі своєю кафедрою та підготуватися до занять іноземною мовою.',
      'Наприкінці учасники зібрали поширені запитання, щоб використати їх під час наступних консультацій.',
    ],
    image: require('../assets/international-partnership.png'),
  },
];

const topicsByCategory = {
  events: ['студентський форум', 'фестиваль ідей', 'день відкритих дверей', 'зустріч випускників'],
  study: ['проєктне навчання', 'вибір дисциплін', 'робота з бібліотекою', 'заняття з англійської'],
  research: ['аналіз відкритих даних', 'підготовка до конференції', 'робота в лабораторії', 'візуалізація даних'],
  opportunities: ['стажування', 'гранти для студентів', 'підготовка резюме', 'портфоліо розробника'],
  community: ['волонтерство', 'студентське самоврядування', 'розмовний клуб', 'наставництво'],
  international: ['академічна мобільність', 'міжнародні проєкти', 'навчання за обміном', 'міжкультурні зустрічі'],
} satisfies Record<keyof typeof categories, string[]>;

const formats = [
  {
    label: 'Анонс',
    summary: 'Учасники зможуть обговорити тему з викладачами та запропонувати власні ідеї.',
    followUp: 'Перед зустріччю варто підготувати одне запитання або коротко описати свій досвід.',
  },
  {
    label: 'Підсумки зустрічі',
    summary: 'Учасники поділилися досвідом і зібрали пропозиції для подальшої роботи.',
    followUp: 'Під час наступної зустрічі учасники повернуться до пропозицій і виберуть ті, які можна перевірити на практиці.',
  },
  {
    label: 'Практикум',
    summary: 'Заняття передбачає роботу в малих групах і обговорення результатів.',
    followUp: 'Наприкінці практикуму кожна група коротко презентує свій підхід і відповість на запитання.',
  },
  {
    label: 'Запитання та відповіді',
    summary: 'Організатори зібрали поширені запитання від студентів для відкритого обговорення.',
    followUp: 'Студенти можуть додати свої запитання до порядку денного наступної консультації.',
  },
  {
    label: 'Командний проєкт',
    summary: 'Студентські команди підготують спільні матеріали та представлять результати.',
    followUp: 'Кожна команда розподілить обов’язки, погодить проміжні терміни й підготує короткий звіт.',
  },
  {
    label: 'Матеріали до заняття',
    summary: 'Викладачі підготували приклади та завдання для самостійної роботи.',
    followUp: 'Після виконання завдань студенти зможуть порівняти свої рішення під час обговорення в групі.',
  },
];

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const archive: ArticleContent[] = formats.flatMap(({ label, summary, followUp }) => (
  (Object.keys(topicsByCategory) as (keyof typeof topicsByCategory)[]).flatMap((category) => (
    topicsByCategory[category].map((topic) => ({
      category,
      title: `${label}: ${topic}`,
      summary,
      paragraphs: [
        `Цей матеріал присвячений темі «${topic}». ${summary}`,
        followUp,
      ],
    }))
  ))
));

export const articles: Article[] = [...highlights, ...archive].map((article, index) => ({
  ...article,
  id: String(index + 1),
  date: dateFormatter.format(new Date(Date.UTC(2026, 10, 12 - Math.floor(index / 2)))),
}));

export const pageSize = 24;
