import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { EditScope } from '@/store/GrowMeContext';
import { formatMonthDay } from '@/utils/date';

import type { ScopeAction } from '../hooks/useTaskSheets';

type RepeatScopeSheetProps = {
  visible: boolean;
  action: ScopeAction;
  date?: string;
  onSelect: (scope: EditScope) => void;
  onClose: () => void;
};

/** 매일 반복 할 일을 수정·삭제할 때 적용 범위를 고릅니다. */
export function RepeatScopeSheet({ visible, action, date, onSelect, onClose }: RepeatScopeSheetProps) {
  const verb = action === 'edit' ? '수정' : '삭제';
  const day = date ? formatMonthDay(date) : '이 날';
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>↻ 반복 할 일을 {verb}할까요?</Text>
          <Text style={styles.copy}>이전 날짜의 완료 기록과 이미 피어난 꽃은 그대로 남아요.</Text>
          <Pressable accessibilityRole="button" onPress={() => onSelect('one')} style={styles.row}>
            <Text style={action === 'delete' ? styles.deleteText : styles.rowText}>{day}만 {verb}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => onSelect('following')} style={styles.row}>
            <Text style={action === 'delete' ? styles.deleteText : styles.rowText}>{day} 이후 모두 {verb}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.row}>
            <Text style={styles.rowText}>취소</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.32)' },
  sheet: { paddingHorizontal: 24, paddingVertical: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FFFFFF' },
  title: { color: '#191F28', fontSize: 18, fontWeight: '700' },
  copy: { color: '#6B7684', fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 10 },
  row: { minHeight: 54, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E8EB' },
  rowText: { color: '#191F28', fontSize: 16 },
  deleteText: { color: '#C65049', fontSize: 16 },
});
