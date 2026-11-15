import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { ProfileMenu } from '@/features/profile/components/ProfileMenu';
import { useCollection } from '@/hooks/useGrowMeQueries';

export default function ProfileScreen() {
  // 사용자 정보 API가 아직 없어 이름·가입 기간은 기존 문구를 유지하고, 꽃 수만 서버 도감에서 가져옵니다.
  const flowerCount = useCollection().data?.length;
  return (
    <ScreenFrame activeTab="profile">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeading title="마이페이지" subtitle="나를 돌보는 작은 습관, 오늘도 함께해요." />
        <View style={styles.profileCard}>
          <Image source={require('@/assets/images/growme/profile-plant.png')} contentFit="contain" style={styles.avatar} />
          <View style={styles.profileCopy}><Text style={styles.name}>새싹 친구님</Text><Text style={styles.meta}>함께한 지 3개월째</Text><Text style={styles.meta}>{flowerCount ?? '-'}송이의 꽃 · 매일 조금씩 자라는 중</Text></View>
        </View>
        <ProfileMenu />
        <View style={styles.footer}><Text style={styles.logout}>로그아웃</Text><Text style={styles.version}>버전 1.0.0</Text></View>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 20 },
  profileCard: { height: 122, marginHorizontal: 24, marginTop: 30, padding: 12, borderRadius: 20, backgroundColor: '#F1F3F5', flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 76, height: 108 },
  profileCopy: { flex: 1, marginLeft: 12, gap: 7 },
  name: { color: '#191F28', fontSize: 20, fontWeight: '700' },
  meta: { color: '#6B7684', fontSize: 12 },
  footer: { marginHorizontal: 24, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between' },
  logout: { color: '#6B7684', fontSize: 13 },
  version: { color: '#9AA4B2', fontSize: 12 },
});
