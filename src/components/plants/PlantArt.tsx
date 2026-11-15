import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { PlantStage } from './plant.types';

const PLANT_IMAGES: Record<PlantStage, number> = {
  sprout: require('@/assets/images/growme/plant-sprout.png'),
  bud: require('@/assets/images/growme/seedling-bud.png'),
  garden: require('@/assets/images/growme/flower-garden.png'),
};

export function PlantArt({ stage }: { stage: PlantStage }) {
  return (
    <Image
      accessible
      accessibilityLabel="Grow Me! 3D로 표현한 나의 식물"
      contentFit="contain"
      source={PLANT_IMAGES[stage]}
      style={[styles.plant, stage === 'garden' && styles.gardenPlant]}
    />
  );
}

const styles = StyleSheet.create({
  plant: { width: '94%', maxWidth: 366, aspectRatio: 366 / 549 },
  gardenPlant: { width: '100%', maxWidth: 390, aspectRatio: 390 / 552 },
});
