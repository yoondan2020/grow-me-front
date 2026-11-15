import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/ui/ActionButton';

type TaskFormSheetProps = {
  visible: boolean;
  value: string;
  selectedDate: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function TaskFormSheet({ visible, value, selectedDate, onChangeValue, onClose, onSave }: TaskFormSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetTitleRow}><Text style={styles.sheetTitle}>작은 실천 적기</Text><Pressable onPress={onClose}><Text style={styles.close}>닫기</Text></Pressable></View>
          <Text style={styles.sheetSubtitle}>오늘 나를 위해 할 일을 적어주세요.</Text>
          <Text style={styles.fieldLabel}>할 일</Text>
          <TextInput autoFocus maxLength={40} onChangeText={onChangeValue} placeholder="예: 책 10쪽 읽기" placeholderTextColor="#9AA4B2" style={styles.input} value={value} />
          <View style={styles.helperRow}><Text style={styles.helper}>가벼운 실천도 좋아요.</Text><Text style={styles.helper}>{value.length} / 40</Text></View>
          <View style={styles.datePill}><Text style={styles.datePillLabel}>날짜</Text><Text style={styles.datePillValue}>2026년 11월 {Number(selectedDate.slice(-2))}일 · 오늘</Text></View>
          <Text style={styles.rules}>하루 최대 3개 · 완료 1개당 월간 성장 +1{ '\n' }추가하거나 내용을 수정해도 성장 수는 바뀌지 않아요.</Text>
          <ActionButton label="저장하기" onPress={onSave} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.32)' },
  sheet: { minHeight: 534, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 32, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#FFFFFF' },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: '#D0D5DB', marginBottom: 23 },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { color: '#191F28', fontSize: 24, fontWeight: '700' },
  close: { color: '#6B7684', fontSize: 14 },
  sheetSubtitle: { color: '#6B7684', fontSize: 14, marginTop: 10 },
  fieldLabel: { color: '#191F28', fontSize: 14, fontWeight: '700', marginTop: 34, marginBottom: 10 },
  input: { height: 62, borderWidth: 1.5, borderColor: '#0064FF', backgroundColor: '#F1F3F5', borderRadius: 16, paddingHorizontal: 16, color: '#191F28', fontSize: 16 },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  helper: { color: '#6B7684', fontSize: 12 },
  datePill: { height: 54, marginTop: 24, borderRadius: 16, backgroundColor: '#F1F3F5', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  datePillLabel: { color: '#6B7684', fontSize: 13 },
  datePillValue: { color: '#191F28', fontSize: 14, fontWeight: '600' },
  rules: { color: '#6B7684', fontSize: 12, lineHeight: 19, marginTop: 20, marginBottom: 20 },
});
