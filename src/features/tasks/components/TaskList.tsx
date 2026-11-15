import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { ActionButton } from '@/components/ui/ActionButton';
import type { DayTask } from '@/store/GrowMeContext';
import { DAILY_TASK_LIMIT } from '@/store/taskSchedule';
import { formatMonthDay, formatMonthDayWeekday } from '@/utils/date';

type TaskListProps = {
  dayTasks: DayTask[];
  selectedDate: string;
  onComplete: (task: DayTask) => void;
  onOpenActions: (task: DayTask) => void;
  onAdd: () => void;
};

export function TaskList({ dayTasks, selectedDate, onComplete, onOpenActions, onAdd }: TaskListProps) {
  return (
    <>
      <View style={styles.dateLine}>
        <Text style={styles.dateTitle}>{formatMonthDayWeekday(selectedDate)}</Text>
        <Text style={styles.count}>{dayTasks.length} / {DAILY_TASK_LIMIT}개 등록</Text>
      </View>
      {dayTasks.length ? (
        <>
          <Text style={styles.progress}>완료 {dayTasks.filter((task) => task.completed).length}/{dayTasks.length}</Text>
          {dayTasks.map((task) => (
            <View key={task.key} style={styles.taskCard}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} onPress={() => onComplete(task)} style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                {task.completed ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
              <Pressable onPress={() => onComplete(task)} style={styles.taskCopy}>
                <View style={styles.titleRow}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>{task.title}</Text>
                  {task.kind === 'daily' && task.endDate ? <RepeatMeta endDate={task.endDate} /> : null}
                </View>
              </Pressable>
              <Pressable accessibilityLabel={`${task.title} 옵션`} onPress={() => onOpenActions(task)} style={styles.more}>
                <Text style={styles.moreText}>···</Text>
              </Pressable>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.empty}>
          <Image source={require('@/assets/images/growme/task-seedling.png')} contentFit="contain" style={styles.emptyPlant} />
          <Text style={styles.emptyTitle}>아직 심은 할 일이 없어요</Text>
          <Text style={styles.emptyCopy}>가벼운 실천 하나로 시작해 보세요.{'\n'}하루에 최대 {DAILY_TASK_LIMIT}개까지 함께할 수 있어요.</Text>
        </View>
      )}
      {dayTasks.length < DAILY_TASK_LIMIT ? (
        <>
          <ActionButton style={[styles.actionMargin, dayTasks.length === 0 && styles.emptyActionMargin]} label={dayTasks.length === 0 ? '+  첫 할 일 추가하기' : '+  할 일 추가하기'} onPress={onAdd} />
          {dayTasks.length > 0 ? <Text style={styles.available}>오늘은 {DAILY_TASK_LIMIT - dayTasks.length}개를 더 추가할 수 있어요.</Text> : null}
        </>
      ) : <Text style={styles.available}>추가는 내일 다시 가능해요. 오늘도 수고했어요!</Text>}
    </>
  );
}

/**
 * 반복 문구. 제목과 같은 줄에 들어가면 오른쪽에 두고, 제목이 길어 다음 줄로 내려가면 왼쪽 아래에 둡니다.
 * 내려갔는지는 실제 배치 위치(y)로 판단합니다. 정렬을 바꿔도 줄바꿈 여부는 변하지 않습니다.
 */
function RepeatMeta({ endDate }: { endDate: string }) {
  const [wrapped, setWrapped] = useState(false);
  const handleLayout = (event: LayoutChangeEvent) => setWrapped(event.nativeEvent.layout.y > 0);
  return (
    <Text onLayout={handleLayout} style={[styles.taskMeta, wrapped && styles.taskMetaWrapped]}>
      ↻ 매일 반복 · {formatMonthDay(endDate)}까지
    </Text>
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
  taskCard: { minHeight: 82, marginHorizontal: 24, marginTop: 12, paddingHorizontal: 16, paddingVertical: 16, borderRadius: 18, backgroundColor: '#F1F3F5', flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 27, height: 27, borderWidth: 1.5, borderColor: '#CED4DA', borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#0064FF', borderColor: '#0064FF' },
  check: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  taskCopy: { flex: 1, marginLeft: 15 },
  // 짧은 제목은 반복 문구와 한 줄에(문구는 오른쪽), 긴 제목은 여러 줄로 감싸고 반복 문구를 다음 줄 왼쪽으로 내립니다.
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 8, rowGap: 4 },
  taskTitle: { flexShrink: 0, maxWidth: '100%', color: '#191F28', fontSize: 16, lineHeight: 22, fontWeight: '600' },
  taskCompleted: { color: '#6B7684', textDecorationLine: 'line-through' },
  taskMeta: { flexShrink: 0, color: '#6B7684', fontSize: 12, marginLeft: 'auto', marginRight: 5 },
  taskMetaWrapped: { marginLeft: 0 },
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
