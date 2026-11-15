import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { BloomSheet } from '@/features/tasks/components/BloomSheet';
import { TaskActionSheet } from '@/features/tasks/components/TaskActionSheet';
import { TaskFormSheet } from '@/features/tasks/components/TaskFormSheet';
import { TaskList } from '@/features/tasks/components/TaskList';
import { WeekCalendar } from '@/features/tasks/components/WeekCalendar';
import { TASK_DATE } from '@/features/tasks/constants';
import { useTaskSheets } from '@/features/tasks/hooks/useTaskSheets';
import { useGrowMe } from '@/store/GrowMeContext';

export default function TasksScreen() {
  const { tasks } = useGrowMe();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(TASK_DATE);
  const sheets = useTaskSheets(selectedDate);
  const dayTasks = tasks.filter((task) => task.date === selectedDate);

  return (
    <ScreenFrame activeTab="tasks">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PageHeading title="할 일" subtitle="오늘도 나만의 속도로 자라요." />
        <WeekCalendar tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <TaskList dayTasks={dayTasks} selectedDate={selectedDate} onComplete={sheets.complete} onOpenActions={sheets.openActions} onAdd={sheets.openNew} />
      </ScrollView>
      <TaskFormSheet visible={sheets.sheet === 'task'} value={sheets.value} selectedDate={selectedDate} onChangeValue={sheets.setValue} onClose={sheets.close} onSave={sheets.save} />
      <TaskActionSheet
        mode={sheets.sheet === 'actions' || sheets.sheet === 'delete' ? sheets.sheet : null}
        taskTitle={sheets.activeTask?.title}
        onEdit={sheets.openEdit}
        onRequestDelete={sheets.requestDelete}
        onConfirmDelete={sheets.confirmDelete}
        onClose={sheets.close}
      />
      <BloomSheet visible={sheets.sheet === 'bloom'} onClose={sheets.close} onViewFlower={() => { sheets.close(); router.push('/collection'); }} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
});
