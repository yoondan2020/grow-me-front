import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { FlowerInfoRow } from '@/features/flower-detail/components/FlowerInfoRow';
import { useGrowMe } from '@/store/GrowMeContext';

export default function FlowerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { flowers } = useGrowMe();
  const flower = flowers.find((item) => item.id === id) ?? flowers[0];
  return (
    <ScreenFrame activeTab="collection">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}><Link href="/collection" style={styles.back}>‹</Link><Text style={styles.headingTitle}>나의 도감</Text></View>
        <Text style={styles.date}>{flower ? `${flower.month.slice(0, 4)}년 ${Number(flower.month.slice(5))}월의 성장 기록` : '2026년 11월의 성장 기록'}</Text>
        <View style={styles.art}>
          <Image source={require('@/assets/images/growme/flower-detail.png')} contentFit="contain" style={styles.image} />
          <View style={styles.badge}><Text style={styles.badgeText}>NO. 003</Text></View>
        </View>
        <Text style={styles.title}>{flower?.name ?? '11월의 데이지'}</Text>
        <Text style={styles.description}>작은 실천이 모여 피어난, 포근한 첫 마음.</Text>
        <View style={styles.info}>
          <FlowerInfoRow label="꽃 이름" value="데이지" />
          <FlowerInfoRow label="첫 개화일" value={flower?.date ?? '2026년 11월 10일'} />
          <FlowerInfoRow label="월 완료 수" value={`${flower?.completions ?? 30}개 · 꽃 2송이`} />
        </View>
        <View style={styles.note}><Text style={styles.noteText}>20개에 첫 꽃, 이후 10개마다 같은 꽃이 더해져요.</Text></View>
      </ScrollView>
    </ScreenFrame>
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
  note: { marginHorizontal: 24, marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: '#E8F3FF' },
  noteText: { color: '#0064FF', fontSize: 12 },
});
