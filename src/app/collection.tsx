import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { CollectionEmpty } from '@/features/collection/components/CollectionEmpty';
import { FlowerRecordCard } from '@/features/collection/components/FlowerRecordCard';
import { useGrowMe } from '@/store/GrowMeContext';

export default function CollectionScreen() {
  const { flowers } = useGrowMe();
  const latestFlowers = [...flowers].reverse();
  const router = useRouter();
  return (
    <ScreenFrame activeTab="collection">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeading title="나의 도감" subtitle="차곡차곡 피워낸 나의 작은 성취" />
        {flowers.length === 0 ? (
          <CollectionEmpty onStart={() => router.push('/tasks')} />
        ) : (
          <>
            <View style={styles.summary}><Text style={styles.summaryLabel}>모은 꽃</Text><Text style={styles.summaryValue}>{flowers.length} 송이</Text><Text style={styles.summaryMeta}>차곡차곡 쌓인 성장 기록</Text></View>
            <View style={styles.yearRow}><Text style={styles.year}>2026년</Text><Text style={styles.sort}>최신순  ↓</Text></View>
            {latestFlowers.map((flower, index) => (
              <FlowerRecordCard key={flower.id} flower={flower} index={index} />
            ))}
            <Text style={styles.footnote}>새로운 달이 와도, 피워낸 기록은 남아요.</Text>
          </>
        )}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  summary: { height: 84, marginHorizontal: 24, marginTop: 30, padding: 16, borderRadius: 18, backgroundColor: '#F1F3F5' },
  summaryLabel: { color: '#6B7684', fontSize: 14, fontWeight: '600' },
  summaryValue: { color: '#191F28', fontSize: 26, fontWeight: '700' },
  summaryMeta: { position: 'absolute', right: 18, top: 44, color: '#6B7684', fontSize: 12 },
  yearRow: { marginHorizontal: 24, marginTop: 30, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  year: { color: '#191F28', fontSize: 18, fontWeight: '700' },
  sort: { color: '#6B7684', fontSize: 13 },
  footnote: { marginTop: 6, marginHorizontal: 24, color: '#6B7684', textAlign: 'center', fontSize: 12 },
});
