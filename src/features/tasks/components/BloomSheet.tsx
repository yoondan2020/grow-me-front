import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { getFlowerImages } from '@/components/plants/flowerImages';
import { ActionButton } from '@/components/ui/ActionButton';
import type { FlowerEntry } from '@/store/flowerList';

type BloomSheetProps = {
  visible: boolean;
  /** 방금 핀 꽃. 이 꽃의 개화 이미지를 보여줍니다. */
  flower: FlowerEntry | null;
  onClose: () => void;
  onViewFlower: () => void;
};

export function BloomSheet({ visible, flower, onClose, onViewFlower }: BloomSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.bloomSheet}>
          <Image source={getFlowerImages(flower?.imageKey).bloom} contentFit="contain" style={styles.bloomImage} accessibilityLabel={flower ? `${flower.flowerName} 이미지` : undefined} />
          <Text style={styles.bloomTitle}>첫 꽃이 피었어요!</Text>
          <Text style={styles.bloomCopy}>작은 실천이 모여 피어난 꽃을{'\n'}도감에 기록했어요.</Text>
          <ActionButton label="꽃 보러 가기" onPress={onViewFlower} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.32)' },
  bloomSheet: { padding: 24, paddingBottom: 32, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center' },
  bloomImage: { width: 180, height: 190 },
  bloomTitle: { color: '#191F28', fontSize: 24, fontWeight: '700', marginTop: 8 },
  bloomCopy: { color: '#6B7684', textAlign: 'center', lineHeight: 24, marginTop: 10, marginBottom: 24 },
});
