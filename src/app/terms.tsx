import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenFrame } from '@/components/ui/ScreenFrame';

const TERMS = [
  ['제1조  서비스의 목적', 'Grow Me!는 일상 속 할 일을 실천하며 월간 식물을 키우고, 피어난 꽃을 수집하는 서비스입니다.'],
  ['제2조  올바른 이용', '할 일은 본인이 직접 작성하고 관리해 주세요. 타인의 권리를 침해하는 내용은 등록할 수 없습니다.'],
  ['제3조  할 일과 성장', '할 일은 매일 반복하는 할 일을 포함해 하루 최대 5개까지 등록할 수 있으며, 완료 1개당 해당 월의 성장 수가 1 증가합니다.\n씨앗 0–4 · 새싹 5–9 · 꽃봉오리 10–19개, 20개에 첫 꽃이 피고 이후 10개마다 같은 꽃이 추가됩니다. 미완료에 따른 성장 페널티는 없습니다.'],
  ['제4조  월간 기록의 보존', '새로운 달에는 새 식물의 성장을 시작합니다. 과거 완료 기록과 도감은 보존됩니다. 할 일을 수정·삭제해도 이미 반영된 성장과 개화 기록은 유지됩니다.'],
  ['제5조  약관의 변경과 문의', '약관이 변경될 경우 적용 전에 서비스에서 안내합니다. 이용 중 궁금한 점은 마이페이지의 문의하기로 보내주세요.'],
];

export default function TermsScreen() {
  return (
    <ScreenFrame showTabs={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}><Link href="/profile" style={styles.back}>‹</Link><Text style={styles.title}>이용약관</Text></View>
        <View style={styles.date}><Text style={styles.dateText}>시행일 2026.11.01</Text></View>
        {TERMS.map(([title, body]) => <View key={title} style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text></View>)}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 36 },
  heading: { marginHorizontal: 24, marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { color: '#191F28', fontSize: 32, lineHeight: 36, width: 24 },
  title: { color: '#191F28', fontSize: 24, fontWeight: '700', lineHeight: 36 },
  date: { alignSelf: 'flex-start', marginHorizontal: 24, marginTop: 20, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 13, backgroundColor: '#E8F3FF' },
  dateText: { color: '#0064FF', fontSize: 12, lineHeight: 18 },
  section: { marginHorizontal: 24, marginTop: 28 },
  sectionTitle: { color: '#191F28', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  body: { color: '#6B7684', fontSize: 14, lineHeight: 22 },
});
