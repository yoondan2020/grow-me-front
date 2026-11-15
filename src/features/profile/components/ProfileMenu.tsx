import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function ProfileMenu() {
  return (
    <>
      <Text style={styles.sectionTitle}>나의 설정</Text>
      <View style={styles.menuGroup}>
        <MenuRow icon="◷" label="알림 설정" />
        <View style={styles.separator} />
        <MenuRow icon="ⓘ" label="성장 안내" />
      </View>
      <Text style={styles.sectionTitle}>서비스 안내</Text>
      <View style={styles.menuGroup}>
        <Link href="/terms" asChild><Pressable style={styles.menuRow} accessibilityRole="link"><Text style={styles.menuIcon}>▤</Text><Text style={styles.menuLabel}>이용약관</Text><Text style={styles.menuArrow}>›</Text></Pressable></Link>
        <View style={styles.separator} />
        <MenuRow icon="▣" label="개인정보 처리방침" />
        <View style={styles.separator} />
        <MenuRow icon="✉" label="문의하기" />
      </View>
    </>
  );
}

function MenuRow({ icon, label }: { icon: string; label: string }) {
  return <View style={styles.menuRow}><Text style={styles.menuIcon}>{icon}</Text><Text style={styles.menuLabel}>{label}</Text><Text style={styles.menuArrow}>›</Text></View>;
}

const styles = StyleSheet.create({
  sectionTitle: { marginHorizontal: 24, marginTop: 26, marginBottom: 12, color: '#191F28', fontSize: 16, fontWeight: '700' },
  menuGroup: { marginHorizontal: 24, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#F1F3F5' },
  menuRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: { width: 22, color: '#6B7684', fontSize: 19, textAlign: 'center' },
  menuLabel: { flex: 1, color: '#191F28', fontSize: 15 },
  menuArrow: { color: '#9AA4B2', fontSize: 24 },
  separator: { height: 1, marginLeft: 36, backgroundColor: '#E5E8EB' },
});
