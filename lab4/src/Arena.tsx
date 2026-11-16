import { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import {
  Directions, GestureDetector, useCompetingGestures, useExclusiveGestures, useFlingGesture,
  useLongPressGesture, usePanGesture, usePinchGesture, useSimultaneousGestures, useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  Easing, cancelAnimation, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { rules, type GestureKind } from './game';
import { useGame } from './GameProvider';
import { Button, Icon, color, font, theme } from './ui';

const tokenSize = 112;
const web = Platform.OS === 'web';
const grid = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(max, Math.max(min, value));
}

function limitPosition(offset: number, size: number, scale: number) {
  'worklet';
  const limit = Math.max(0, (size - tokenSize * scale) / 2 - 10);
  return clamp(offset, -limit, limit);
}

export function Arena({ generation }: { generation: number }) {
  const { record, preferences } = useGame();
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);
  const charge = useSharedValue(0);
  const halo = useSharedValue(0);
  const sequence = useSharedValue(0);
  const panStartedAt = useSharedValue(0);
  const swiped = useSharedValue(false);
  const pendingDrags = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = pendingDrags.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const credit = useCallback((kind: GestureKind) => {
    record(kind, generation);
    if (preferences.effects) {
      halo.value = 1;
      halo.value = withDelay(50, withTiming(0, { duration: 320 }));
    }
  }, [generation, halo, preferences.effects, record]);

  const creditMotion = useCallback((kind: 'drag' | 'left' | 'right', id: number) => {
    const pending = pendingDrags.current;

    if (kind === 'drag') {
      // On lift, a native fling can be delivered after the pan ends.
      const timer = setTimeout(() => {
        pending.delete(id);
        credit('drag');
      }, 70);
      pending.set(id, timer);
      return;
    }

    clearTimeout(pending.get(id));
    pending.delete(id);
    credit(kind);
  }, [credit]);

  function measure(event: LayoutChangeEvent) {
    width.value = event.nativeEvent.layout.width;
    height.value = event.nativeEvent.layout.height;
  }

  useAnimatedReaction(() => ({ width: width.value, height: height.value }), (size) => {
    x.value = limitPosition(x.value, size.width, scale.value);
    y.value = limitPosition(y.value, size.height, scale.value);
  });

  const singleTap = useTapGesture({
    numberOfTaps: 1,
    maxDuration: 230,
    maxDistance: 10,
    onDeactivate: (event) => {
      'worklet';
      if (!event.canceled) scheduleOnRN(credit, 'tap');
    },
  });
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    maxDelay: 250,
    maxDuration: 230,
    maxDistance: 10,
    onDeactivate: (event) => {
      'worklet';
      if (!event.canceled) scheduleOnRN(credit, 'double');
    },
  });
  const taps = useExclusiveGestures(doubleTap, singleTap);

  const hold = useLongPressGesture({
    minDuration: rules.holdMs,
    maxDistance: 11,
    numberOfPointers: 1,
    onBegin: () => {
      'worklet';
      charge.value = 0;
      charge.value = withTiming(1, { duration: rules.holdMs, easing: Easing.linear });
    },
    onActivate: () => {
      'worklet';
      scheduleOnRN(credit, 'hold');
    },
    onFinalize: () => {
      'worklet';
      cancelAnimation(charge);
      charge.value = 0;
    },
  });

  function acceptFling(direction: 'left' | 'right') {
    'worklet';
    if (swiped.value) return;
    swiped.value = true;
    scheduleOnRN(creditMotion, direction, sequence.value);
  }

  const pan = usePanGesture({
    minDistance: 12,
    maxPointers: 1,
    shouldCancelWhenOutside: false,
    onBegin: () => {
      'worklet';
      sequence.value += 1;
      swiped.value = false;
      if (web) panStartedAt.value = Date.now();
      startX.value = x.value;
      startY.value = y.value;
    },
    onUpdate: (event) => {
      'worklet';
      x.value = limitPosition(startX.value + event.translationX, width.value, scale.value);
      y.value = limitPosition(startY.value + event.translationY, height.value, scale.value);
    },
    onDeactivate: (event) => {
      'worklet';
      if (event.canceled || swiped.value) return;

      if (web) {
        // A browser may coalesce the samples needed by the Fling recognizer.
        const horizontal = Math.abs(event.translationX);
        const elapsed = Math.max(1, Date.now() - panStartedAt.value);
        if (elapsed <= 400 && horizontal >= 36 && horizontal >= 2 * Math.abs(event.translationY)
            && horizontal / elapsed >= 0.7) {
          acceptFling(event.translationX > 0 ? 'right' : 'left');
          return;
        }
      }

      if (Math.hypot(x.value - startX.value, y.value - startY.value) >= 12) {
        scheduleOnRN(creditMotion, 'drag', sequence.value);
      }
    },
  });
  const flingLeft = useFlingGesture({
    direction: Directions.LEFT,
    numberOfPointers: 1,
    shouldCancelWhenOutside: false,
    onActivate: () => {
      'worklet';
      acceptFling('left');
    },
  });
  const flingRight = useFlingGesture({
    direction: Directions.RIGHT,
    numberOfPointers: 1,
    shouldCancelWhenOutside: false,
    onActivate: () => {
      'worklet';
      acceptFling('right');
    },
  });
  const motion = useSimultaneousGestures(pan, flingLeft, flingRight);

  const pinch = usePinchGesture({
    shouldCancelWhenOutside: false,
    onActivate: () => {
      'worklet';
      startScale.value = scale.value;
      startX.value = x.value;
      startY.value = y.value;
    },
    onUpdate: (event) => {
      'worklet';
      const next = clamp(startScale.value * event.scale, rules.minScale, rules.maxScale);
      scale.value = next;
      x.value = limitPosition(startX.value, width.value, next);
      y.value = limitPosition(startY.value, height.value, next);
    },
    onDeactivate: (event) => {
      'worklet';
      if (event.canceled) {
        scale.value = startScale.value;
        x.value = limitPosition(startX.value, width.value, startScale.value);
        y.value = limitPosition(startY.value, height.value, startScale.value);
      } else if (Math.abs(scale.value / startScale.value - 1) >= rules.pinchThreshold) {
        scheduleOnRN(credit, 'pinch');
      }
    },
  });
  const gestures = useCompetingGestures(pinch, hold, motion, taps);

  const positionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: halo.value * 0.75, transform: [{ scale: 1.2 - 0.16 * halo.value }],
  }));
  const chargeStyle = useAnimatedStyle(() => ({ width: (charge.value * 100) + '%' }));

  function center() {
    x.value = 0;
    y.value = 0;
    scale.value = 1;
  }

  function scaleWithButton(factor: number) {
    const previous = scale.value;
    const next = clamp(previous * factor, rules.minScale, rules.maxScale);
    scale.value = next;
    x.value = limitPosition(x.value, width.value, next);
    y.value = limitPosition(y.value, height.value, next);
    if (Math.abs(next / previous - 1) >= rules.pinchThreshold) credit('pinch');
  }

  return (
    <View style={[theme.card, styles.card]}>
      <View style={styles.arena} onLayout={measure}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {grid.map((coordinate) => (
            <View key={'x' + coordinate} style={[styles.vertical, { left: coordinate + '%' }]} />
          ))}
          {grid.map((coordinate) => (
            <View key={'y' + coordinate} style={[styles.horizontal, { top: coordinate + '%' }]} />
          ))}
          <View style={styles.outerOrbit} />
          <View style={styles.innerOrbit} />
        </View>
        <Animated.View style={[styles.position, positionStyle]}>
          <GestureDetector gesture={gestures} touchAction="none" userSelect="none">
            <View
              testID="clicker-token"
              accessibilityLabel="Ігровий жетон"
              style={styles.token}
              collapsable={false}
            >
              <Animated.View pointerEvents="none" style={[styles.halo, haloStyle]} />
              <View pointerEvents="none" style={styles.coinEdge}>
                <View style={styles.coinFace}><Icon name="flash" size={48} tint={color.onPrimary} /></View>
              </View>
            </View>
          </GestureDetector>
        </Animated.View>
        <View pointerEvents="none" style={styles.chargeTrack}>
          <Animated.View style={[styles.chargeFill, chargeStyle]} />
        </View>
      </View>

      <View style={styles.toolbar}>
        <Button title="Центрувати" icon="locate-outline" label="Центрувати жетон" onPress={center} />
        {web ? (
          <View style={styles.scaleTools}>
            <Text style={theme.small}>Масштаб</Text>
            <Button icon="remove" label="Зменшити жетон" onPress={() => scaleWithButton(0.8)} />
            <Button icon="add" label="Збільшити жетон" onPress={() => scaleWithButton(1.25)} />
          </View>
        ) : <Text style={[theme.small, styles.touchHint]}>Масштаб двома пальцями</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 262, padding: 8, gap: 8 },
  arena: {
    flex: 1, minHeight: 210, borderRadius: 12, overflow: 'hidden',
    backgroundColor: color.arena,
  },
  vertical: { position: 'absolute', width: 1, top: 0, bottom: 0, backgroundColor: color.arenaLine, opacity: 0.54 },
  horizontal: { position: 'absolute', height: 1, left: 0, right: 0, backgroundColor: color.arenaLine, opacity: 0.54 },
  outerOrbit: {
    position: 'absolute', left: '50%', top: '50%', width: 202, height: 202,
    marginLeft: -101, marginTop: -101, borderWidth: 1, borderColor: color.orbit, borderRadius: 101, borderStyle: 'dashed',
  },
  innerOrbit: {
    position: 'absolute', left: '50%', top: '50%', width: 155, height: 155,
    marginLeft: -77.5, marginTop: -77.5, borderWidth: 1, borderColor: color.orbit, borderRadius: 78,
  },
  position: {
    position: 'absolute', left: '50%', top: '50%', width: tokenSize, height: tokenSize,
    marginLeft: -tokenSize / 2, marginTop: -tokenSize / 2,
  },
  token: {
    width: tokenSize, height: tokenSize, alignItems: 'center', justifyContent: 'center',
  },
  halo: {
    position: 'absolute', width: tokenSize + 12, height: tokenSize + 12,
    borderRadius: (tokenSize + 12) / 2, borderWidth: 3, borderColor: color.goldHighlight,
  },
  coinEdge: {
    width: tokenSize, height: tokenSize, borderRadius: tokenSize / 2, padding: 8, alignItems: 'center',
    justifyContent: 'center', backgroundColor: color.goldRim, borderWidth: 2, borderColor: color.goldHighlight,
    shadowColor: color.primary, shadowOpacity: 0.36, shadowOffset: { width: 0, height: 5 }, shadowRadius: 14, elevation: 8,
  },
  coinFace: {
    flex: 1, width: '100%', backgroundColor: color.gold, borderRadius: tokenSize / 2,
    borderWidth: 2, borderColor: color.goldInner, alignItems: 'center', justifyContent: 'center',
  },
  chargeTrack: {
    height: 5, borderRadius: 3, overflow: 'hidden', position: 'absolute',
    left: 14, right: 14, bottom: 11, backgroundColor: color.track,
  },
  chargeFill: { backgroundColor: color.gold, height: '100%', borderRadius: 3 },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5,
  },
  scaleTools: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  touchHint: { flexShrink: 1, textAlign: 'right', fontFamily: font.medium },
});
