import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PLANT_CANVAS, PlantArt } from './PlantArt';
import type { PlantStage } from './plant.types';

/** Figma 'C 확정' 프레임(402×874) 기준 배치. 식물 캔버스는 프레임 안 (43.24, 354.91)에 놓입니다. */
const SCENE = { width: 402, height: 874 } as const;
const PLANT_POSITION = { left: 43.24, top: 354.91 } as const;

/**
 * 홈의 정원 장면. 공통 배경 위에 현재 단계 식물을 겹쳐 그립니다.
 * 화면이 Figma 프레임보다 낮으면 하늘(위쪽)부터 잘라 식물과 땅이 항상 보이게 합니다.
 * stage가 null이면(서버에서 단계를 불러오는 중) 배경만 그립니다.
 */
export function Plant({ stage, flowerKey }: { stage: PlantStage | null; flowerKey?: string | null }) {
  return (
    <View style={styles.viewport}>
      <View style={styles.scene}>
        <Image
          accessible={false}
          contentFit="cover"
          source={require('@/assets/images/growme/garden-background.png')}
          style={StyleSheet.absoluteFill}
        />
        {stage ? (
          <View style={styles.plant}>
            <PlantArt stage={stage} flowerKey={flowerKey} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: { flex: 1, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: '#94CCED' },
  scene: { width: '100%', aspectRatio: SCENE.width / SCENE.height },
  plant: {
    position: 'absolute',
    left: `${(PLANT_POSITION.left / SCENE.width) * 100}%`,
    top: `${(PLANT_POSITION.top / SCENE.height) * 100}%`,
    width: `${(PLANT_CANVAS.width / SCENE.width) * 100}%`,
  },
});
