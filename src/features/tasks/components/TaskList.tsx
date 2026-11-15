import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ui/ActionButton';
import type { GrowTask } from '@/store/GrowMeContext';

import { DAYS } from '../constants';

type TaskListProps = {
  dayTasks: GrowTask[];
  selectedDate: string;
  onComplete: (task: GrowTask) => void;
  onOpenActions: (task: GrowTask) => void;
  onAdd: () => void;
};

export function TaskList({ dayTasks, selectedDate, onComplete, onOpenActions, onAdd }: TaskListProps) {
  return (
    <>
      <View style={styles.dateLine}>
        <Text style={styles.dateTitle}>11월 {Number(selectedDate.slice(-2))}일 {DAYS.find((item) => item.day === String(Number(selectedDate.slice(-2))))?.weekday ?? ''}요일</Text>
        <Text style={styles.count}>{dayTasks.length} / 3개 등록</Text>
      </View>
      {dayTasks.length ? (
        <>
          <Text style={styles.progress}>완료 {dayTasks.filter((task) => task.completed).length}/3 · 완료할 때마다 이번 달 +1</Text>
          {dayTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} onPress={() => onComplete(task)} style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                {task.completed ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
              <Pressable onPress={() => onComplete(task)} style={styles.taskCopy}>
                <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.completed ? '완료했어요 · 월간 성장 +1' : '작은 실천 습관 쌓기'}</Text>
              </Pressable>
              <Pressable accessibilityLabel={`${task.title} 옵션`} onPress={() => onOpenActions(task)} style={styles.more}><Text style={styles.moreText}>···</Text></Pressable>
            </View>
          ))}
          {dayTasks.length < 3 ? <View style={styles.growthNote}><Text style={styles.growthText}>완료한 만큼만, 차곡차곡 자라요.{ '\n' }하루를 쉬어도 쌓인 성장은 그대로예요.</Text></View> : <View style={styles.limitNote}><Text style={styles.limitText}>오늘은 3개를 모두 채웠어요</Text></View>}
        </>
      ) : (
        <View style={styles.empty}>
          <Image source={require('@/assets/images/growme/task-seedling.png')} contentFit="contain" style={styles.emptyPlant} />
          <Text style={styles.emptyTitle}>아직 심은 할 일이 없어요</Text>
          <Text style={styles.emptyCopy}>가벼운 실천 하나로 시작해 보세요.{ '\n' }하루에 최대 3개까지 함께할 수 있어요.</Text>
        </View>
      )}
      {dayTasks.length < 3 ? (
        <>
          <ActionButton style={[styles.actionMargin, dayTasks.length === 0 && styles.emptyActionMargin]} label={dayTasks.length === 0 ? '+  첫 할 일 추가하기' : '+  할 일 추가하기'} onPress={onAdd} />
          {dayTasks.length > 0 ? <Text style={styles.available}>오늘은 {3 - dayTasks.length}개를 더 추가할 수 있어요.</Text> : null}
        </>
      ) : <Text style={styles.available}>추가는 내일 다시 가능해요. 오늘도 수고했어요!</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  dateLine: { marginTop: 27, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateTitle: { color: '#191F28', fontSize: 20, fontWeight: '700' },
  count: { color: '#0064FF', fontSize: 14, fontWeight: '700' },
  progress: { marginTop: 8, marginHorizontal: 24, color: '#6B7684', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 24, paddingBottom: 24 },
  emptyPlant: { width: 150, height: 145 },
  emptyTitle: { color: '#191F28', fontSize: 20, fontWeight: '700', marginTop: 18 },
  emptyCopy: { color: '#6B7684', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 10 },
  taskCard: { minHeight: 82, marginHorizontal: 24, marginTop: 12, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#F1F3F5', flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 27, height: 27, borderWidth: 1.5, borderColor: '#CED4DA', borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#0064FF', borderColor: '#0064FF' },
  check: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  taskCopy: { flex: 1, marginLeft: 15 },
  taskTitle: { color: '#191F28', fontSize: 16, fontWeight: '600' },
  taskCompleted: { color: '#6B7684', textDecorationLine: 'line-through' },
  taskMeta: { marginTop: 4, color: '#6B7684', fontSize: 12 },
  more: { width: 26, alignItems: 'center' },
  moreText: { color: '#6B7684', fontSize: 20 },
  growthNote: { marginHorizontal: 24, marginTop: 24, padding: 16, backgroundColor: '#E8F3FF', borderRadius: 16 },
  growthText: { color: '#0064FF', fontSize: 14, lineHeight: 20 },
  limitNote: { height: 54, marginHorizontal: 24, marginTop: 14, borderRadius: 16, backgroundColor: '#F1F3F5', alignItems: 'center', justifyContent: 'center' },
  limitText: { color: '#6B7684', fontSize: 16, fontWeight: '700' },
  actionMargin: { marginHorizontal: 24, marginTop: 24 },
  emptyActionMargin: { marginTop: 36 },
  available: { marginHorizontal: 24, marginTop: 10, color: '#6B7684', fontSize: 12, textAlign: 'center' },
});
