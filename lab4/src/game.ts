export const rules = {
  target: 100,
  holdMs: 3000,
  comboMs: 8000,
  tapPoints: 1,
  doublePoints: 2,
  holdPoints: 5,
  swipeMin: 3,
  swipeMax: 9,
  pinchPoints: 4,
  pinchThreshold: 0.12,
  minScale: 0.72,
  maxScale: 1.55,
} as const;

export type GestureKind = 'tap' | 'double' | 'hold' | 'drag' | 'left' | 'right' | 'pinch';

export const gestureLabels: Record<GestureKind, string> = {
  tap: 'Один дотик',
  double: 'Подвійний дотик',
  hold: 'Утримання',
  drag: 'Перетягування',
  left: 'Свайп ліворуч',
  right: 'Свайп праворуч',
  pinch: 'Зміна масштабу',
};

export type Progress = {
  score: number;
  counts: Record<GestureKind, number>;
  combo: boolean;
};

export const initialProgress: Progress = {
  score: 0,
  counts: { tap: 0, double: 0, hold: 0, drag: 0, left: 0, right: 0, pinch: 0 },
  combo: false,
};

export type Preferences = { effects: boolean };
export const initialPreferences: Preferences = { effects: true };

export const goalSpecs = [
  { id: 'tap', title: '10 одиночних дотиків', description: 'Торкнися жетона один раз, зроби коротку паузу й повтори.', target: 10, icon: 'finger-print-outline' },
  { id: 'double', title: '5 подвійних дотиків', description: 'Швидко торкнися жетона двічі поспіль.', target: 5, icon: 'copy-outline' },
  { id: 'hold', title: 'Утримати жетон 3 секунди', description: 'Не рухай пальцем, поки смуга утримання не заповниться.', target: 1, icon: 'timer-outline' },
  { id: 'drag', title: 'Перетягнути жетон', description: 'Притисни жетон і плавно пересунь його в межах поля.', target: 1, icon: 'move-outline' },
  { id: 'swipe', title: 'Свайпнути в обидва боки', description: 'Починаючи з жетона, швидко проведи праворуч і ліворуч окремими рухами.', target: 2, icon: 'swap-horizontal-outline' },
  { id: 'pinch', title: 'Змінити розмір жетона', description: 'Зведи або розведи два пальці на жетоні. У браузері також доступні кнопки «−» і «+».', target: 1, icon: 'resize-outline' },
  { id: 'score', title: 'Набрати 100 очок', description: 'Поєднуй дотики та бонусні жести, щоб набрати потрібну суму.', target: rules.target, icon: 'trophy-outline' },
  { id: 'combo', title: 'Поєднати два жести', description: 'Одразу після подвійного дотику утримай жетон 3 секунди. На комбінацію є 8 секунд.', target: 1, icon: 'flash-outline' },
] as const;

export function getGoals(progress: Progress) {
  return goalSpecs.map((goal) => {
    let current: number;
    switch (goal.id) {
      case 'swipe':
        current = Number(progress.counts.left > 0) + Number(progress.counts.right > 0);
        break;
      case 'score':
        current = progress.score;
        break;
      case 'combo':
        current = Number(progress.combo);
        break;
      default:
        current = progress.counts[goal.id];
    }
    return { ...goal, current: Math.min(current, goal.target), done: current >= goal.target };
  });
}

export function pointsForGesture(gesture: GestureKind) {
  switch (gesture) {
    case 'tap': return rules.tapPoints;
    case 'double': return rules.doublePoints;
    case 'hold': return rules.holdPoints;
    case 'pinch': return rules.pinchPoints;
    case 'left':
    case 'right':
      return rules.swipeMin + Math.floor(Math.random() * (rules.swipeMax - rules.swipeMin + 1));
    case 'drag': return 0;
  }
}
