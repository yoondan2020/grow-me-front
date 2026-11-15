import { StyleSheet, Text, View } from 'react-native';

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { paddingHorizontal: 24, paddingTop: 14 },
  title: { color: '#191F28', fontSize: 28, fontWeight: '700', lineHeight: 42, letterSpacing: -0.4 },
  subtitle: { marginTop: 5, color: '#6B7684', fontSize: 16, lineHeight: 24 },
});
