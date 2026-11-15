import { StyleSheet, Text, View } from 'react-native';

export function FlowerInfoRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  infoRow: { minHeight: 40, flexDirection: 'row', alignItems: 'center' },
  infoLabel: { width: 110, color: '#6B7684', fontSize: 14 },
  infoValue: { color: '#191F28', fontSize: 14, fontWeight: '600' },
});
