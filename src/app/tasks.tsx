import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { PlantWateringEffect } from '@/components/plants/PlantWateringEffect';
import { ErrorNotice, LoadingIndicator } from '@/components/ui/ApiStatus';
import { PageHeading } from '@/components/ui/PageHeading';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { BloomSheet } from '@/features/tasks/components/BloomSheet';
import { RepeatScopeSheet } from '@/features/tasks/components/RepeatScopeSheet';
import { TaskActionSheet } from '@/features/tasks/components/TaskActionSheet';
import { TaskFormSheet } from '@/features/tasks/components/TaskFormSheet';
import { TaskCalendar } from '@/features/tasks/components/TaskCalendar';
import { TaskList } from '@/features/tasks/components/TaskList';
import { useTaskSheets } from '@/features/tasks/hooks/useTaskSheets';
import { useDateStatuses, useDayTasks } from '@/hooks/useGrowMeQueries';
import { usePlantStage } from '@/hooks/usePlantStage';
import { todayKey } from '@/utils/date';

const NO_STATUSES = {};

export default function TasksScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayKey);
  /** 월간 달력에서 날짜를 고르지 않고 넘겨 본 달. 날짜를 고르면 선택한 날짜의 달로 돌아갑니다. */
  const [browsingDate, setBrowsingDate] = useState<string | null>(null);
  const sheets = useTaskSheets(selectedDate);
  const plantStage = usePlantStage();
  const dayTasks = useDayTasks(selectedDate);
  const dateStatuses = useDateStatuses(browsingDate ?? selectedDate);
  const selectDate = (date: string) => {
    setSelectedDate(date);
    setBrowsingDate(null);
  };

  return (
    <ScreenFrame activeTab="tasks">
      <PageHeading title="할 일" subtitle="오늘도 나만의 속도로 자라요." />
      <TaskCalendar
        dateStatuses={dateStatuses.data ?? NO_STATUSES}
        selectedDate={selectedDate}
        onSelectDate={selectDate}
        onVisibleMonthChange={setBrowsingDate}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {sheets.actionError ? <ErrorNotice error={sheets.actionError} onDismiss={sheets.dismissActionError} /> : null}
          {dayTasks.data ? (
            <TaskList dayTasks={dayTasks.data} selectedDate={selectedDate} onComplete={sheets.complete} onOpenActions={sheets.openActions} onAdd={sheets.openNew} />
          ) : dayTasks.error ? (
            <ErrorNotice error={dayTasks.error} onRetry={() => { dayTasks.reload(); dateStatuses.reload(); }} />
          ) : (
            <LoadingIndicator label="할 일을 불러오는 중이에요" />
          )}
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
        <PlantWateringEffect key={sheets.wateringKey} stage={plantStage?.stage ?? 'seed'} flowerKey={plantStage?.flowerKey} onFinish={sheets.finishWatering} />
      ) : null}
      <BloomSheet visible={sheets.sheet === 'bloom'} flower={sheets.bloomedFlower} onClose={sheets.close} onViewFlower={() => { sheets.close(); router.push('/collection'); }} />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
});
