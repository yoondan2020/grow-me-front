import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getFlowerImage } from '@/components/plants/flowerImages';
import type { FlowerEntry } from '@/store/flowerList';
import { formatFullDate } from '@/utils/date';

export function FlowerRecordCard({ entry }: { entry: FlowerEntry }) {
  const { flowerName, bloomDate, completionCount, monthOrder, imageVariant } = entry;
  return (
    <Link href={{ pathname: '/flower/[id]', params: { id: String(entry.id) } }} asChild>
      <Pressable style={styles.record} accessibilityRole="link">
        <View style={styles.thumb}>
          <Image source={getFlowerImage(imageVariant)} contentFit="contain" style={styles.thumbImage} />
        </View>
        <View style={styles.recordCopy}>
          <Text style={styles.recordTitle}>{flowerName}</Text>
          <Text style={styles.recordDate}>첫 개화 {formatFullDate(bloomDate)}</Text>
          <Text style={styles.recordMeta}>완료 {completionCount}개 · 꽃 {monthOrder}송이</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  record: { height: 121, marginHorizontal: 24, marginBottom: 18, padding: 12, borderRadius: 18, backgroundColor: '#F1F3F5', flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 96, height: 97, alignItems: 'center', justifyContent: 'center' },
  thumbImage: { width: 90, height: 95 },
  recordCopy: { flex: 1, marginLeft: 16, gap: 7 },
  recordTitle: { color: '#191F28', fontSize: 17, fontWeight: '700' },
  recordDate: { color: '#6B7684', fontSize: 12 },
  recordMeta: { color: '#6B7684', fontSize: 13 },
  arrow: { color: '#6B7684', fontSize: 24 },
});
