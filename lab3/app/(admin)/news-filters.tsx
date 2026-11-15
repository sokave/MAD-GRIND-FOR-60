import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAdmin } from '../../src/admin';
import { categories, emptyNewsFilters, newsStatus, type NewsStatus } from '../../src/data';
import { FilterSheet } from '../../src/FilterSheet';
import { Choices } from '../../src/ui';

const categoryOptions = [
  { value: null, label: 'Усі категорії' },
  ...categories.map((category) => ({ value: category, label: category })),
];

const statusOptions = [
  { value: null, label: 'Усі статуси' },
  ...(Object.keys(newsStatus) as NewsStatus[]).map((status) => ({ value: status, label: newsStatus[status] })),
];

export default function NewsFiltersScreen() {
  const { newsFilters, setNewsFilters } = useAdmin();
  const [draft, setDraft] = useState(newsFilters);
  const router = useRouter();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/news');
  }

  return (
    <FilterSheet
      title="Фільтри новин"
      onClose={close}
      onReset={() => setDraft(emptyNewsFilters)}
      onApply={() => {
        setNewsFilters(draft);
        close();
      }}
    >
      <Choices label="Категорія" options={categoryOptions} value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
      <Choices label="Статус новини" options={statusOptions} value={draft.status} onChange={(status) => setDraft({ ...draft, status })} />
    </FilterSheet>
  );
}
