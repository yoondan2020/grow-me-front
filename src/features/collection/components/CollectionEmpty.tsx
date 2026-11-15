import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ui/ActionButton';

export function CollectionEmpty({ onStart }: { onStart: () => void }) {
  return (
    <>
      <View style={styles.summaryEmpty}><Text style={styles.summaryLabel}>지금까지 모은 꽃</Text>
        <Text style={styles.summaryValue}>0 송이</Text>
      </View>
      <View style={styles.emptyArt}>
        <Image source={require('@/assets/images/growme/collection-seedling.png')} contentFit="contain" style={styles.emptyImage} />
      </View>
      <Text style={styles.emptyTitle}>첫 꽃을 기다리고 있어요</Text>
      <Text style={styles.emptyCopy}>한 달 동안 할 일 20개를 완료하면{'\n'}나만의 첫 꽃이 도감에 기록돼요.</Text>
      <ActionButton style={styles.actionMargin} label="첫 꽃 키우러 가기" onPress={onStart} />
    </>
  );
}

const styles = StyleSheet.create({
  summaryEmpty: { height: 71, marginHorizontal: 24, marginTop: 24, paddingHorizontal: 18, borderRadius: 18, backgroundColor: '#F1F3F5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { color: '#6B7684', fontSize: 14, fontWeight: '600' },
  summaryValue: { color: '#191F28', fontSize: 26, fontWeight: '700' },
  emptyArt: { height: 260, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  emptyImage: { width: 238, height: 236 },
  emptyTitle: { marginHorizontal: 24, marginTop: 8, color: '#191F28', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  emptyCopy: { marginTop: 12, color: '#6B7684', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  actionMargin: { marginHorizontal: 24, marginTop: 68 },
});
