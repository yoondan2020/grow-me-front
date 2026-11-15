import { StyleSheet, View } from 'react-native';

import { PlantArt } from './PlantArt';
import type { PlantStage } from './plant.types';

export function Plant({ stage }: { stage: PlantStage }) {
  return (
    <View style={[styles.content, stage === 'garden' && styles.gardenContent]}>
      <PlantArt stage={stage} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', paddingTop: 64 },
  gardenContent: { paddingTop: 69 },
});
