import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PlantArt } from './PlantArt';
import type { PlantStage } from './plant.types';

/** 물 주기 연출 전체 길이 */
export const WATERING_DURATION = 3000;

const FADE_MS = 250;
const DROP_FALL_MS = 700;
const DROP_COUNT = 7;
const DROP_COLOR = '#8FC2FF';

type PlantWateringEffectProps = {
  stage: PlantStage;
  /** 이달의 꽃 image_key. 꽃봉오리·개화 단계 이미지에 씁니다. */
  flowerKey?: string | null;
  /** 연출이 끝나거나 사용자가 눌러 건너뛰면 호출됩니다. */
  onFinish: () => void;
};

/** 할 일을 완료했을 때 식물 위로 물방울이 떨어지는 3초 연출. 화면 위에 겹쳐 표시합니다. */
export function PlantWateringEffect({ stage, flowerKey, onFinish }: PlantWateringEffectProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const sway = useSharedValue(0);
  const lift = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility('식물에 물을 줬어요. 이번 달 성장 +1');
    opacity.value = withSequence(
      withTiming(1, { duration: FADE_MS }),
      withDelay(WATERING_DURATION - FADE_MS * 2, withTiming(0, { duration: FADE_MS })),
    );
    if (!reduceMotion) {
      // 물을 맞으며 좌우로 살짝 흔들리고, 끝에서 한 번 기지개를 켭니다.
      sway.value = withRepeat(withSequence(
        withTiming(-3, { duration: 350, easing: Easing.inOut(Easing.quad) }),
        withTiming(3, { duration: 350, easing: Easing.inOut(Easing.quad) }),
      ), 3, true);
      lift.value = withDelay(2000, withSequence(
        withTiming(1.06, { duration: 250, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) }),
      ));
    }
    const timer = setTimeout(onFinish, WATERING_DURATION);
    return () => clearTimeout(timer);
    // 마운트될 때 한 번만 재생합니다. 다시 재생하려면 key를 바꿔 새로 마운트합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const plantStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sway.value}deg` }, { scale: lift.value }],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable accessibilityRole="button" accessibilityLabel="물 주기 애니메이션 건너뛰기" onPress={onFinish} style={styles.pressArea}>
        <View style={styles.card}>
          <View style={styles.scene}>
            <Animated.View style={[styles.plant, plantStyle]}>
              <PlantArt stage={stage} flowerKey={flowerKey} />
            </Animated.View>
            {reduceMotion ? null : Array.from({ length: DROP_COUNT }, (_, index) => <WaterDrop key={index} index={index} />)}
          </View>
          <Text style={styles.title}>💧 물을 줬어요!</Text>
          <Text style={styles.copy}>오늘도 자라나는 중</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** 위에서 식물 쪽으로 떨어지는 물방울 하나. 위치와 시작 시점을 조금씩 다르게 둡니다. */
function WaterDrop({ index }: { index: number }) {
  const progress = useSharedValue(0);
  const left = 28 + ((index * 37) % 120);

  useEffect(() => {
    progress.value = withDelay(
      150 + index * 110,
      withRepeat(withTiming(1, { duration: DROP_FALL_MS, easing: Easing.in(Easing.quad) }), 3, false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.85 ? 1 : (1 - progress.value) / 0.15,
    transform: [{ translateY: -20 + progress.value * 130 }, { rotate: '45deg' }],
  }));

  return <Animated.View style={[styles.drop, { left }, dropStyle]} />;
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 100, backgroundColor: 'rgba(25,31,40,0.32)' },
  pressArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: 264, paddingTop: 20, paddingBottom: 24, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center' },
  scene: { width: 180, height: 220, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  plant: { width: 140, alignItems: 'center', transformOrigin: 'bottom' },
  // 한쪽 모서리만 각진 원을 45도 돌려 물방울 모양을 만듭니다.
  drop: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: DROP_COLOR,
  },
  title: { marginTop: 12, color: '#191F28', fontSize: 20, fontWeight: '700' },
  copy: { marginTop: 6, color: '#6B7684', fontSize: 14 },
});
