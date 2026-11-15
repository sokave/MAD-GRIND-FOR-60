import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAdmin } from '../../src/admin';
import { emptyUserFilters, userRoles, userStatus, type UserStatus } from '../../src/data';
import { FilterSheet } from '../../src/FilterSheet';
import { Choices } from '../../src/ui';

const roleOptions = [
  { value: null, label: 'Усі ролі' },
  ...userRoles.map((role) => ({ value: role, label: role })),
];

const statusOptions = [
  { value: null, label: 'Усі статуси' },
  ...(Object.keys(userStatus) as UserStatus[]).map((status) => ({ value: status, label: userStatus[status] })),
];

export default function UserFiltersScreen() {
  const { userFilters, setUserFilters } = useAdmin();
  const [draft, setDraft] = useState(userFilters);
  const router = useRouter();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/users');
  }

  return (
    <FilterSheet
      title="Фільтри користувачів"
      onClose={close}
      onReset={() => setDraft(emptyUserFilters)}
      onApply={() => {
        setUserFilters(draft);
        close();
      }}
    >
      <Choices label="Роль" options={roleOptions} value={draft.role} onChange={(role) => setDraft({ ...draft, role })} />
      <Choices label="Статус облікового запису" options={statusOptions} value={draft.status} onChange={(status) => setDraft({ ...draft, status })} />
    </FilterSheet>
  );
}
