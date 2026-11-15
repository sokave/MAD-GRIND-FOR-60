export const adminAccount = {
  name: 'Артур Некрасов',
  email: 'admin@example.com',
  password: 'lab3demo',
};

export const categories = ['Університет', 'Навчання', 'Події', 'Наука', 'Можливості'] as const;
export type Category = (typeof categories)[number];

export const newsStatus = {
  published: 'Опубліковано',
  draft: 'Чернетка',
  review: 'На перевірці',
} as const;
export type NewsStatus = keyof typeof newsStatus;

export const userStatus = {
  active: 'Активний',
  blocked: 'Заблокований',
} as const;
export type UserStatus = keyof typeof userStatus;

export const userRoles = ['Редактор', 'Автор', 'Читач', 'Модератор'] as const;
export type UserRole = (typeof userRoles)[number];

export type NewsInput = {
  title: string;
  category: Category;
  status: NewsStatus;
  imageUrl: string;
  body: string;
};

export type News = NewsInput & {
  id: string;
  createdAt: string;
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export const auditLabels = {
  login: 'Вхід у систему',
  logout: 'Вихід із системи',
  createNews: 'Створення новини',
  editNews: 'Редагування новини',
  deleteNews: 'Видалення новини',
  changeUserStatus: 'Зміна статусу користувача',
} as const;
export type AuditAction = keyof typeof auditLabels;

export type AuditEntry = {
  id: string;
  action: AuditAction;
  detail: string;
  actor: string;
  createdAt: string;
};

export type Records = {
  news: News[];
  users: PortalUser[];
  logs: AuditEntry[];
  nextNewsId: number;
};

export type NewsFilters = { category: Category | null; status: NewsStatus | null };
export type UserFilters = { role: UserRole | null; status: UserStatus | null };

export const emptyNewsFilters: NewsFilters = { category: null, status: null };
export const emptyUserFilters: UserFilters = { role: null, status: null };

export const coverUrls = {
  team: 'https://news.ztu.edu.ua/wp-content/uploads/2026/11/dsc05203-825x510.jpg',
  campus: 'https://news.ztu.edu.ua/wp-content/uploads/2026/11/golovne-825x510.png',
  partnership: 'https://news.ztu.edu.ua/wp-content/uploads/2026/11/chehiya.png',
};

const recentTopics: [string, Category, string, string][] = [
  [
    'Студенти представили командні проєкти',
    'Навчання',
    coverUrls.team,
    'Студентські команди презентували свої проєкти та обговорили з викладачами, як розвивати їх далі. Учасники отримали відгуки про прототипи та визначили наступні кроки.',
  ],
  [
    'Університети готують спільну програму обміну',
    'Університет',
    coverUrls.campus,
    'Представники університетів обговорили спільні заняття та короткі навчальні візити. Деталі програми редакція уточнює в координаторів.',
  ],
  [
    'Відкрита зустріч із міжнародними партнерами',
    'Події',
    coverUrls.partnership,
    'На зустрічі студенти зможуть дізнатися про навчання в університетах-партнерах і поставити запитання про участь у програмах обміну.',
  ],
  [
    'Студентів запрошують до дослідницької лабораторії',
    'Наука',
    coverUrls.team,
    'Викладачі підготували практичні завдання й короткі консультації. Учасники зможуть обрати тему та спланувати невелике дослідження.',
  ],
  [
    'Відкрито набір на консультації з портфоліо',
    'Можливості',
    coverUrls.campus,
    'Учасники зможуть обговорити свої навчальні проєкти, підготувати приклади робіт і отримати відгук від наставників.',
  ],
];

const topicsByCategory: Record<Category, string[]> = {
  Університет: ['відкритий день', 'зустріч з випускниками', 'оновлення бібліотеки', 'робота студентської ради'],
  Навчання: ['вибір дисциплін', 'практикум з дизайну', 'підготовка до сесії', 'командна робота'],
  Події: ['студентський форум', 'фестиваль ідей', 'волонтерська зустріч', 'день кар’єри'],
  Наука: ['підготовка до конференції', 'відкриті дані', 'робота в лабораторії', 'презентація дослідження'],
  Можливості: ['навчальні гранти', 'стажування', 'академічна мобільність', 'підготовка резюме'],
};

const formats = ['Анонс', 'Підсумки', 'Практичні матеріали'];
const covers = Object.values(coverUrls);
const statusSequence: NewsStatus[] = [
  'published', 'draft', 'review', 'published', 'published',
  'draft', 'published', 'review', 'published', 'published',
];
const libraryTopics = formats.flatMap((format) => categories.flatMap((category) =>
  topicsByCategory[category].map((topic, index): [string, Category, string, string] => [
    format + ' — ' + topic,
    category,
    covers[(index + categories.indexOf(category)) % covers.length],
    'Навчальний матеріал на тему «' + topic + '». Редакція зібрала пропозиції від студентів і викладачів. Під час підготовки матеріалу учасники обговорили приклади, запитання й подальші кроки.',
  ]),
));
const seedTime = Date.UTC(2026, 10, 12, 12);

const initialNews = [...recentTopics, ...libraryTopics].slice(0, 60).map(
  ([title, category, imageUrl, body], index): News => ({
    id: String(index + 1),
    title,
    category,
    imageUrl,
    body,
    status: statusSequence[index % statusSequence.length],
    createdAt: new Date(seedTime - index * 4 * 60 * 60 * 1000).toISOString(),
  }),
);

const givenNames = ['Марія', 'Андрій', 'Софія', 'Олександр', 'Ірина', 'Данило', 'Анна', 'Богдан', 'Катерина', 'Максим'];
const familyNames = ['Бондар', 'Левченко', 'Мельник', 'Савчук', 'Ткаченко', 'Шевченко'];

const initialUsers = Array.from({ length: 60 }, (_, index): PortalUser => ({
  id: 'user-' + (index + 1),
  name: givenNames[index % givenNames.length] + ' ' + familyNames[Math.floor(index / givenNames.length)],
  email: 'campus.user' + (index + 1) + '@example.com',
  role: userRoles[index % userRoles.length],
  status: (index + 1) % 6 === 0 ? 'blocked' : 'active',
}));

const auditActions = Object.keys(auditLabels) as AuditAction[];
const sampleDetails = [
  'Розпочато сеанс адміністратора',
  'Завершено сеанс адміністратора',
  'Додано матеріал «День відкритих дверей»',
  'Оновлено матеріал «Студентський форум»',
  'Видалено навчальну чернетку',
  'Оновлено статус демонстраційного облікового запису',
];

const initialLogs = Array.from({ length: 60 }, (_, index): AuditEntry => ({
  id: 'log-' + (60 - index),
  action: auditActions[index % auditActions.length],
  detail: sampleDetails[index % sampleDetails.length],
  actor: adminAccount.name,
  createdAt: new Date(seedTime - index * 42 * 60 * 1000).toISOString(),
}));

export const initialRecords: Records = {
  news: initialNews,
  users: initialUsers,
  logs: initialLogs,
  nextNewsId: initialNews.length + 1,
};

export const dateLabel = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const logDateLabel = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('');
}
