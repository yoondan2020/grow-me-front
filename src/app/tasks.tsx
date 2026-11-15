import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { PlantWateringEffect } from '@/components/plants/PlantWateringEffect';
import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { BloomSheet } from '@/features/tasks/components/BloomSheet';
import { RepeatScopeSheet } from '@/features/tasks/components/RepeatScopeSheet';
import { TaskActionSheet } from '@/features/tasks/components/TaskActionSheet';
import { TaskFormSheet } from '@/features/tasks/components/TaskFormSheet';
import { TaskCalendar } from '@/features/tasks/components/TaskCalendar';
import { TaskList } from '@/features/tasks/components/TaskList';
import { useTaskSheets } from '@/features/tasks/hooks/useTaskSheets';
import { usePlantStage } from '@/hooks/usePlantStage';
import { useGrowMe } from '@/store/GrowMeContext';
import { getDateStatuses, getDayTasks } from '@/store/taskSchedule';
import { todayKey } from '@/utils/date';

export default function TasksScreen() {
  const { tasks, dailyTasks } = useGrowMe();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const sheets = useTaskSheets(selectedDate);
  const plantStage = usePlantStage();
  const dayTasks = getDayTasks(tasks, dailyTasks, selectedDate);
  const dateStatuses = useMemo(() => getDateStatuses(tasks, dailyTasks), [tasks, dailyTasks]);

  return (
    <ScreenFrame activeTab="tasks">
      <PageHeading title="할 일" subtitle="오늘도 나만의 속도로 자라요." />
      <TaskCalendar dateStatuses={dateStatuses} selectedDate={selectedDate} onSelectDate={setSelectedDate}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TaskList dayTasks={dayTasks} selectedDate={selectedDate} onComplete={sheets.complete} onOpenActions={sheets.openActions} onAdd={sheets.openNew} />
        </ScrollView>
      </TaskCalendar>
      <TaskFormSheet
        visible={sheets.sheet === 'task'}
        value={sheets.value}
        date={sheets.formDate}
        isEditing={sheets.isEditing}
        repeatDaily={sheets.repeatDaily}
        repeatEndDate={sheets.repeatEndDate}
        error={sheets.formError}
        onChangeValue={sheets.setValue}
        onChangeDate={sheets.changeFormDate}
        onChangeRepeatDaily={sheets.setRepeatDaily}
        onChangeRepeatEndDate={sheets.changeRepeatEndDate}
        onClose={sheets.close}
        onSave={sheets.save}
      />
      <RepeatScopeSheet visible={sheets.sheet === 'scope'} action={sheets.scopeAction} date={sheets.activeTask?.date} onSelect={sheets.applyScope} onClose={sheets.close} />
      <TaskActionSheet
        mode={sheets.sheet === 'actions' || sheets.sheet === 'delete' ? sheets.sheet : null}
        taskTitle={sheets.activeTask?.title}
        onEdit={sheets.openEdit}
        onRequestDelete={sheets.requestDelete}
        onConfirmDelete={sheets.confirmDelete}
        onClose={sheets.close}
      />
      {sheets.wateringKey !== null ? (
        <PlantWateringEffect key={sheets.wateringKey} stage={plantStage} onFinish={sheets.finishWatering} />
      ) : null}
      <BloomSheet visible={sheets.sheet === 'bloom'} onClose={sheets.close} onViewFlower={() => { sheets.close(); router.push('/collection'); }} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
});
