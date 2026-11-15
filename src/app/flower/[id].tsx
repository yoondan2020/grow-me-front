import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getFlowerImage } from '@/components/plants/flowerImages';
import { ErrorNotice, LoadingIndicator } from '@/components/ui/ApiStatus';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { FlowerInfoRow } from '@/features/flower-detail/components/FlowerInfoRow';
import { useCollectionEntry } from '@/hooks/useGrowMeQueries';
import { ApiError } from '@/services/apiClient';
import type { FlowerEntry } from '@/store/flowerList';
import { formatFullDate, parseDateKey } from '@/utils/date';

export default function FlowerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = useCollectionEntry(id);
  const notFound = !id || (entry.error instanceof ApiError && entry.error.status === 404);

  return (
    <ScreenFrame activeTab="collection">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}><Link href="/collection" style={styles.back}>‹</Link><Text style={styles.headingTitle}>나의 도감</Text></View>
        {entry.data ? (
          <FlowerDetail entry={entry.data} />
        ) : notFound ? (
          <FlowerNotFound />
        ) : entry.error ? (
          <ErrorNotice error={entry.error} onRetry={entry.reload} />
        ) : (
          <LoadingIndicator label="꽃 기록을 불러오는 중이에요" />
        )}
      </ScrollView>
    </ScreenFrame>
  );
}

function FlowerDetail({ entry }: { entry: FlowerEntry }) {
  const { flowerName, bloomDate, completionCount, collectionNumber, monthOrder, imageVariant } = entry;
  const month = parseDateKey(`${entry.month}-01`);
  return (
    <>
      <Text style={styles.date}>{`${month.getFullYear()}년 ${month.getMonth() + 1}월의 성장 기록`}</Text>
      <View style={styles.art}>
        <Image source={getFlowerImage(imageVariant)} contentFit="contain" style={styles.image} accessibilityLabel={`${flowerName} 이미지`} />
        <View style={styles.badge}><Text style={styles.badgeText}>NO. {String(collectionNumber).padStart(3, '0')}</Text></View>
      </View>
      <Text style={styles.title}>{flowerName}</Text>
      <Text style={styles.description}>
        {monthOrder === 1 ? '작은 실천이 모여 피어난, 포근한 첫 마음.' : '꾸준한 실천이 더해져, 같은 꽃이 한 송이 더 피었어요.'}
      </Text>
      <View style={styles.info}>
        <FlowerInfoRow label="꽃 이름" value={flowerName} />
        <FlowerInfoRow label="개화일" value={formatFullDate(bloomDate)} />
        <FlowerInfoRow label="월 완료 수" value={`${completionCount}개 · 이달의 ${monthOrder}번째 꽃`} />
      </View>
    </>
  );
}

/** 잘못된 링크라서 서버에 꽃 기록이 없을 때 */
function FlowerNotFound() {
  return (
    <View style={styles.notFound}>
      <Text style={styles.notFoundTitle}>꽃 기록을 찾을 수 없어요</Text>
      <Text style={styles.notFoundCopy}>도감에서 다시 골라 주세요.</Text>
      <Link href="/collection" style={styles.notFoundLink}>도감으로 돌아가기</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 20 },
  heading: { marginTop: 14, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 24, color: '#191F28', fontSize: 32 },
  headingTitle: { color: '#191F28', fontSize: 24, fontWeight: '700' },
  date: { marginHorizontal: 24, marginTop: 18, color: '#6B7684', fontSize: 16 },
  art: { height: 291, marginHorizontal: 24, marginTop: 20, borderRadius: 22, backgroundColor: '#F1F3F5', alignItems: 'center', justifyContent: 'center' },
  image: { width: 262, height: 266 },
  badge: { position: 'absolute', left: 16, top: 16, height: 26, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#E8F3FF', justifyContent: 'center' },
  badgeText: { color: '#0064FF', fontSize: 12, fontWeight: '700' },
  title: { marginHorizontal: 24, marginTop: 20, color: '#191F28', fontSize: 26, fontWeight: '700' },
  description: { marginHorizontal: 24, marginTop: 8, color: '#6B7684', fontSize: 14 },
  info: { marginHorizontal: 24, marginTop: 24, paddingHorizontal: 18, borderRadius: 18, backgroundColor: '#F1F3F5' },
  notFound: { marginHorizontal: 24, marginTop: 80, alignItems: 'center' },
  notFoundTitle: { color: '#191F28', fontSize: 20, fontWeight: '700' },
  notFoundCopy: { marginTop: 8, color: '#6B7684', fontSize: 14 },
  notFoundLink: { marginTop: 20, color: '#0064FF', fontSize: 15, fontWeight: '600' },
});
