import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type PropsWithChildren } from 'react';
import {
  gestureLabels, initialPreferences, initialProgress, pointsForGesture, rules,
  type GestureKind, type Preferences, type Progress,
} from './game';

const storageKey = 'mobile-labs.lab4.game.v1';

type Result = { gesture: GestureKind; points: number; combo: boolean };
type Snapshot = { progress: Progress; preferences: Preferences };
type GameState = Snapshot & {
  ready: boolean;
  generation: number;
  last: Result | null;
  comboStartedAt: number | null;
};

type Action =
  | { type: 'hydrate'; snapshot: Snapshot }
  | { type: 'gesture'; gesture: GestureKind; points: number; generation: number; time: number }
  | { type: 'effects'; enabled: boolean }
  | { type: 'reset' };

const initialSnapshot = { progress: initialProgress, preferences: initialPreferences };
const initialState: GameState = {
  ...initialSnapshot, ready: false, generation: 0, last: null, comboStartedAt: null,
};

function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'hydrate') return { ...state, ...action.snapshot, ready: true };
  if (!state.ready) return state;

  switch (action.type) {
    case 'effects':
      return { ...state, preferences: { effects: action.enabled } };
    case 'reset':
      return { ...state, progress: initialProgress, last: null, comboStartedAt: null, generation: state.generation + 1 };
    case 'gesture': {
      if (action.generation !== state.generation) return state;
      const { gesture, points, time } = action;
      const qualifies = gesture === 'hold' && state.comboStartedAt !== null
        && time >= state.comboStartedAt && time - state.comboStartedAt <= rules.comboMs;
      const progress = {
        score: state.progress.score + points,
        counts: { ...state.progress.counts, [gesture]: state.progress.counts[gesture] + 1 },
        combo: state.progress.combo || qualifies,
      };
      return {
        ...state,
        progress,
        last: { gesture, points, combo: qualifies && !state.progress.combo },
        comboStartedAt: gesture === 'double' ? time : null,
      };
    }
  }
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function decode(raw: string | null): Snapshot {
  if (!raw) return initialSnapshot;
  const stored = JSON.parse(raw) as { progress?: Partial<Progress>; preferences?: Partial<Preferences> } | null;
  const data = stored?.progress;
  if (!isCount(data?.score) || typeof data?.combo !== 'boolean' || !data.counts
      || !(Object.keys(gestureLabels) as GestureKind[]).every((key) => isCount(data.counts?.[key]))) {
    throw new Error('Invalid stored progress');
  }
  return {
    progress: { score: data.score, combo: data.combo, counts: data.counts },
    preferences: { effects: stored?.preferences?.effects !== false },
  };
}

type GameContextValue = GameState & {
  record: (gesture: GestureKind, generation: number) => void;
  setEffects: (enabled: boolean) => void;
  reset: () => void;
  storageMessage: string;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [storageMessage, setStorageMessage] = useState('');
  const writes = useRef(Promise.resolve());
  const canWrite = useRef(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey).then((raw) => {
      if (mounted) dispatch({ type: 'hydrate', snapshot: decode(raw) });
    }).catch(() => {
      if (!mounted) return;
      setStorageMessage('Не вдалося відновити локальний прогрес.');
      dispatch({ type: 'hydrate', snapshot: initialSnapshot });
    });
    return () => { mounted = false; };
  }, []);

  const { progress, preferences, ready } = state;
  useEffect(() => {
    if (!ready) return;
    if (!canWrite.current) {
      canWrite.current = true;
      return;
    }
    let mounted = true;
    const snapshot = JSON.stringify({ progress, preferences });
    const write = writes.current.then(() => AsyncStorage.setItem(storageKey, snapshot));
    writes.current = write.catch(() => {});
    write.then(
      () => { if (mounted) setStorageMessage(''); },
      () => { if (mounted) setStorageMessage('Не вдалося зберегти зміни на цьому пристрої.'); },
    );
    return () => { mounted = false; };
  }, [progress, preferences, ready]);

  const record = useCallback((gesture: GestureKind, generation: number) => {
    dispatch({ type: 'gesture', gesture, points: pointsForGesture(gesture), generation, time: Date.now() });
  }, []);

  return (
    <GameContext.Provider value={{
      ...state, record, storageMessage,
      setEffects: (enabled) => dispatch({ type: 'effects', enabled }),
      reset: () => dispatch({ type: 'reset' }),
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame requires GameProvider');
  return value;
}
