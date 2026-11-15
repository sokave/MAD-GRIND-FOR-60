import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type PropsWithChildren,
} from 'react';
import {
  adminAccount, auditLabels, categories, emptyNewsFilters, emptyUserFilters, initialRecords,
  newsStatus, userRoles, userStatus,
  type AuditAction, type NewsInput, type NewsFilters, type Records, type UserFilters, type UserStatus,
} from './data';

const storageKey = 'mobile-labs.lab3.records.v1';

type AdminState = {
  records: Records;
  ready: boolean;
  isAuthenticated: boolean;
  revision: number;
};

type AdminAction =
  | { type: 'hydrate'; records: Records }
  | ({ createdAt: string } & (
    | { type: 'login' | 'logout' }
    | { type: 'saveNews'; id?: string; input: NewsInput }
    | { type: 'deleteNews'; id: string }
    | { type: 'setUserStatus'; id: string; status: UserStatus }
  ));

const initialState: AdminState = {
  records: initialRecords,
  ready: false,
  isAuthenticated: false,
  revision: 0,
};

function recordAction(
  state: AdminState, records: Records, action: AuditAction, detail: string, createdAt: string,
): AdminState {
  return {
    ...state,
    revision: state.revision + 1,
    records: {
      ...records,
      logs: [{
        id: 'log-' + (records.logs.length + 1),
        action,
        detail,
        actor: adminAccount.name,
        createdAt,
      }, ...records.logs],
    },
  };
}

function reducer(state: AdminState, action: AdminAction): AdminState {
  if (action.type === 'hydrate') {
    return { ...state, records: action.records, ready: true };
  }

  if (!state.ready) return state;

  const { records, isAuthenticated } = state;
  const { createdAt } = action;

  if (action.type === 'login') {
    if (isAuthenticated) return state;
    return recordAction({ ...state, isAuthenticated: true }, records,
      'login', 'Розпочато сеанс адміністратора', createdAt);
  }
  if (!isAuthenticated) return state;

  switch (action.type) {
    case 'logout':
      return recordAction({ ...state, isAuthenticated: false }, records,
        'logout', 'Завершено сеанс адміністратора', createdAt);
    case 'saveNews': {
      if (!action.id) {
        const news = [{
          ...action.input, id: String(records.nextNewsId), createdAt,
        }, ...records.news];
        return recordAction(state, { ...records, news, nextNewsId: records.nextNewsId + 1 },
          'createNews', action.input.title, createdAt);
      }
      const original = records.news.find((item) => item.id === action.id);
      if (!original) return state;
      const { title, category, status, imageUrl, body } = action.input;
      if (original.title === title && original.category === category && original.status === status
          && original.imageUrl === imageUrl && original.body === body) return state;
      const news = records.news.map((item) => item.id === action.id ? { ...item, ...action.input } : item);
      return recordAction(state, { ...records, news }, 'editNews', title, createdAt);
    }
    case 'deleteNews': {
      const original = records.news.find((item) => item.id === action.id);
      if (!original) return state;
      const news = records.news.filter((item) => item.id !== action.id);
      return recordAction(state, { ...records, news }, 'deleteNews', original.title, createdAt);
    }
    case 'setUserStatus': {
      const original = records.users.find((item) => item.id === action.id);
      if (!original || original.status === action.status) return state;
      const users = records.users.map((item) => (
        item.id === action.id ? { ...item, status: action.status } : item
      ));
      return recordAction(state, { ...records, users }, 'changeUserStatus',
        original.name + ' · ' + userStatus[original.status] + ' → ' + userStatus[action.status], createdAt);
    }
    default:
      return state;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasStrings(value: Record<string, unknown>, fields: string[]) {
  return fields.every((field) => typeof value[field] === 'string');
}

function isDate(value: unknown) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isRecords(value: unknown): value is Records {
  if (!isObject(value)) return false;
  const { news, users, logs, nextNewsId } = value;
  return typeof nextNewsId === 'number' && Number.isSafeInteger(nextNewsId) && nextNewsId > 0
    && Array.isArray(news) && news.every((item) => isObject(item)
      && hasStrings(item, ['id', 'title', 'body', 'imageUrl'])
      && categories.some((category) => category === item.category)
      && Object.keys(newsStatus).includes(String(item.status)) && isDate(item.createdAt))
    && Array.isArray(users) && users.every((item) => isObject(item)
      && hasStrings(item, ['id', 'name', 'email'])
      && userRoles.some((role) => role === item.role)
      && Object.keys(userStatus).includes(String(item.status)))
    && Array.isArray(logs) && logs.every((item) => isObject(item)
      && hasStrings(item, ['id', 'detail', 'actor'])
      && Object.keys(auditLabels).includes(String(item.action)) && isDate(item.createdAt));
}

type AdminContextValue = AdminState & {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  saveNews: (input: NewsInput, id?: string) => void;
  deleteNews: (id: string) => void;
  setUserStatus: (id: string, status: UserStatus) => void;
  newsFilters: NewsFilters;
  setNewsFilters: (filters: NewsFilters) => void;
  userFilters: UserFilters;
  setUserFilters: (filters: UserFilters) => void;
  storageMessage: string;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newsFilters, setNewsFilters] = useState(emptyNewsFilters);
  const [userFilters, setUserFilters] = useState(emptyUserFilters);
  const [storageMessage, setStorageMessage] = useState('');
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then((saved) => {
      if (!active) return;
      const content: unknown = saved ? JSON.parse(saved) : initialRecords;
      if (!isRecords(content)) throw new Error('Invalid stored records');
      dispatch({ type: 'hydrate', records: content });
    }).catch(() => {
      if (!active) return;
      setStorageMessage('Не вдалося прочитати локальні дані. Відкрито початкові записи.');
      dispatch({ type: 'hydrate', records: initialRecords });
    });
    return () => { active = false; };
  }, []);

  const { records, revision } = state;
  useEffect(() => {
    if (revision === 0) return;
    let active = true;
    const snapshot = JSON.stringify(records);
    const write = writes.current.then(() => AsyncStorage.setItem(storageKey, snapshot));
    writes.current = write.catch(() => {});
    write.then(() => {
      if (active) setStorageMessage('');
    }, () => {
      if (active) setStorageMessage('Не вдалося записати дані у сховище. Зміни доступні в поточному сеансі.');
    });
    return () => { active = false; };
  }, [records, revision]);

  function login(email: string, password: string) {
    const valid = state.ready && email.trim().toLowerCase() === adminAccount.email
      && password === adminAccount.password;
    if (valid) dispatch({ type: 'login', createdAt: new Date().toISOString() });
    return valid;
  }

  function logout() {
    setNewsFilters(emptyNewsFilters);
    setUserFilters(emptyUserFilters);
    dispatch({ type: 'logout', createdAt: new Date().toISOString() });
  }

  function saveNews(input: NewsInput, id?: string) {
    dispatch({ type: 'saveNews', id, input, createdAt: new Date().toISOString() });
  }

  function deleteNews(id: string) {
    dispatch({ type: 'deleteNews', id, createdAt: new Date().toISOString() });
  }

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    dispatch({ type: 'setUserStatus', id, status, createdAt: new Date().toISOString() });
  }, []);

  return (
    <AdminContext.Provider value={{
      ...state, login, logout, saveNews, deleteNews, setUserStatus,
      newsFilters, setNewsFilters, userFilters, setUserFilters, storageMessage,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin requires AdminProvider');
  return value;
}
