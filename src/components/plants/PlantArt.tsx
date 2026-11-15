import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { getFlowerImages } from './flowerImages';
import type { PlantStage } from './plant.types';

/**
 * 다섯 단계 이미지는 모두 같은 투명 캔버스(Figma 식물 상자 315.52×391.68 + 개화 꽃잎이 위로 넘치는 26.09)를 씁니다.
 * 바닥 접지 위치가 단계마다 같아서 이미지만 바꿔도 같은 자리에서 자라는 것처럼 보입니다.
 */
export const PLANT_CANVAS = { width: 315.52, height: 417.77 } as const;

/** 꽃이 정해지기 전 단계의 공용 이미지. 꽃봉오리·개화는 이달의 꽃 이미지(flowerImages)를 씁니다. */
const COMMON_STAGE_IMAGES: Record<'seed' | 'sprout' | 'growth', number> = {
  seed: require('@/assets/images/growme/plant-stage-seed.png'),
  sprout: require('@/assets/images/growme/plant-stage-sprout.png'),
  growth: require('@/assets/images/growme/plant-stage-growth.png'),
};

function getStageImage(stage: PlantStage, flowerKey: string | null | undefined): number {
  if (stage === 'bud' || stage === 'bloom') return getFlowerImages(flowerKey)[stage];
  return COMMON_STAGE_IMAGES[stage];
}

const STAGE_LABELS: Record<PlantStage, string> = {
  seed: '씨앗',
  sprout: '새싹',
  growth: '성장',
  bud: '꽃봉오리',
  bloom: '개화',
};

/**
 * 배경 없이 식물만 그립니다. 너비는 부모를 채우고 높이는 캔버스 비율을 따릅니다.
 * flowerKey는 이달의 꽃 image_key이며, 꽃봉오리·개화 단계에서만 씁니다.
 */
export function PlantArt({ stage, flowerKey }: { stage: PlantStage; flowerKey?: string | null }) {
  return (
    <Image
      accessible
      accessibilityLabel={`나의 식물, ${STAGE_LABELS[stage]} 단계`}
      contentFit="contain"
      source={getStageImage(stage, flowerKey)}
      style={styles.plant}
    />
  );
}

const styles = StyleSheet.create({
  plant: { width: '100%', aspectRatio: PLANT_CANVAS.width / PLANT_CANVAS.height },
});
