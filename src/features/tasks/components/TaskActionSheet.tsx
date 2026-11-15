import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type TaskActionSheetProps = {
  mode: 'actions' | 'delete' | null;
  taskTitle?: string;
  onEdit: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onClose: () => void;
};

export function TaskActionSheet({ mode, taskTitle, onEdit, onRequestDelete, onConfirmDelete, onClose }: TaskActionSheetProps) {
  return (
    <>
      <Modal transparent visible={mode === 'actions'} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={onClose} /><View style={styles.actionSheet}><Text style={styles.actionSheetTitle}>{taskTitle}</Text><Pressable onPress={onEdit} style={styles.actionRow}><Text style={styles.actionText}>수정하기</Text></Pressable><Pressable onPress={onRequestDelete} style={styles.actionRow}><Text style={styles.deleteText}>삭제하기</Text></Pressable><Pressable onPress={onClose} style={styles.actionRow}><Text style={styles.actionText}>취소</Text></Pressable></View></View>
      </Modal>
      <Modal transparent visible={mode === 'delete'} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalBackdrop}><View style={styles.confirm}><Text style={styles.confirmTitle}>할 일을 삭제할까요?</Text><Text style={styles.confirmCopy}>삭제한 할 일은 복구할 수 없어요.{ '\n' }이미 피어난 꽃은 도감에 남아 있어요.</Text><View style={styles.confirmActions}><Pressable onPress={onClose} style={styles.cancel}><Text style={styles.actionText}>취소</Text></Pressable><Pressable onPress={onConfirmDelete} style={styles.deleteButton}><Text style={styles.deleteButtonText}>삭제</Text></Pressable></View></View></View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.32)' },
  actionSheet: { paddingHorizontal: 24, paddingVertical: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FFFFFF' },
  actionSheetTitle: { color: '#191F28', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  actionRow: { minHeight: 54, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E8EB' },
  actionText: { color: '#191F28', fontSize: 16 },
  deleteText: { color: '#C65049', fontSize: 16 },
  confirm: { marginHorizontal: 24, marginBottom: 180, padding: 24, borderRadius: 22, backgroundColor: '#FFFFFF' },
  confirmTitle: { color: '#191F28', fontSize: 20, fontWeight: '700' },
  confirmCopy: { color: '#6B7684', fontSize: 14, lineHeight: 21, marginTop: 12 },
  confirmActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancel: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F3F5', borderRadius: 24 },
  deleteButton: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#C65049', borderRadius: 24 },
  deleteButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
