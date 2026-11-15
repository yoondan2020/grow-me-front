import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { CollectionEmpty } from '@/features/collection/components/CollectionEmpty';
import { FlowerRecordCard } from '@/features/collection/components/FlowerRecordCard';
import { groupFlowersByYear, type FlowerSort } from '@/store/flowerList';
import { useGrowMe } from '@/store/GrowMeContext';

export default function CollectionScreen() {
  const { flowers } = useGrowMe();
  const [sort, setSort] = useState<FlowerSort>('latest');
  const sections = useMemo(() => groupFlowersByYear(flowers, sort), [flowers, sort]);
  const toggleSort = () => setSort((current) => (current === 'latest' ? 'oldest' : 'latest'));
  const router = useRouter();
  return (
    <ScreenFrame activeTab="collection">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeading title="나의 도감" subtitle="차곡차곡 피워낸 나의 작은 성취" />
        {flowers.length === 0 ? (
          <CollectionEmpty onStart={() => router.push('/tasks')} />
        ) : (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>모은 꽃</Text>
              <Text style={styles.summaryValue}>{flowers.length} 송이</Text>
            </View>
            {sections.map((section, sectionIndex) => (
              <View key={section.year}>
                <View style={styles.yearRow}>
                  <Text accessibilityRole="header" style={styles.year}>{section.year}년</Text>
                  {sectionIndex === 0 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`정렬: ${sort === 'latest' ? '최신순' : '오래된순'}. 눌러서 ${sort === 'latest' ? '오래된순' : '최신순'}으로 바꾸기`}
                      hitSlop={8}
                      onPress={toggleSort}>
                      <Text style={styles.sort}>{sort === 'latest' ? '최신순  ↓' : '오래된순  ↑'}</Text>
                    </Pressable>
                  ) : null}
                </View>
                {section.entries.map((entry) => (
                  <FlowerRecordCard key={entry.flower.id} entry={entry} />
                ))}
              </View>
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
  summary: {
    height: 'auto', marginHorizontal: 24, marginTop: 30, padding: 16, borderRadius: 18, backgroundColor: '#F1F3F5',
    flexDirection: 'row', textAlign: 'center', alignItems: 'center'
  },
  summaryLabel: { color: '#6B7684', fontSize: 14, fontWeight: '600' },
  summaryValue: { color: '#191F28', fontSize: 26, fontWeight: '700', marginLeft: 'auto', marginRight: 10 },
  summaryMeta: { position: 'absolute', right: 18, top: 44, color: '#6B7684', fontSize: 12 },
  yearRow: { marginHorizontal: 24, marginTop: 30, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  year: { color: '#191F28', fontSize: 18, fontWeight: '700' },
  sort: { color: '#6B7684', fontSize: 13 },
  footnote: { marginTop: 6, marginHorizontal: 24, color: '#6B7684', textAlign: 'center', fontSize: 12 },
});
