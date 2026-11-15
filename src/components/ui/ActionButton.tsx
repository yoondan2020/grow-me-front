import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

export function ActionButton({ label, onPress, secondary = false, style }: { label: string; onPress: () => void; secondary?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={[styles.actionButton, secondary && styles.secondaryButton, style]}>
      <Text style={[styles.actionLabel, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: { minHeight: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0064FF' },
  actionLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginHorizontal: 24 },
  secondaryButton: { backgroundColor: '#F1F3F5', borderRadius: 16 },
  secondaryLabel: { color: '#191F28' },
});
