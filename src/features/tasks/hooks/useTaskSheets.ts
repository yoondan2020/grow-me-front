import { useState } from 'react';

import { useGrowMe, type DayTask, type EditScope } from '@/store/GrowMeContext';
import { DAILY_TASK_LIMIT, getDayTasks } from '@/store/taskSchedule';
import { addDays, formatMonthDay } from '@/utils/date';

export type TaskSheet = 'task' | 'actions' | 'delete' | 'scope' | 'bloom' | null;
export type ScopeAction = 'edit' | 'delete';

/** 매일 반복을 켰을 때 기본 종료일: 시작일 포함 7일 */
const DEFAULT_REPEAT_DAYS = 7;

export function useTaskSheets(selectedDate: string) {
  const { tasks, dailyTasks, addTask, addDailyTask, editTask, moveTask, updateDailyPeriod, removeTask, toggleTask } = useGrowMe();
  const [sheet, setSheet] = useState<TaskSheet>(null);
  const [editing, setEditing] = useState<DayTask | null>(null);
  const [activeTask, setActiveTask] = useState<DayTask | null>(null);
  const [value, setValue] = useState('');
  /** 일반 할 일의 날짜, 반복 할 일의 시작일 */
  const [formDate, setFormDate] = useState(selectedDate);
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [repeatEndDate, setRepeatEndDate] = useState(selectedDate);
  const [formError, setFormError] = useState<string | null>(null);
  const [scopeAction, setScopeAction] = useState<ScopeAction>('edit');
  /** 물 주기 연출 재생 번호. null이면 재생하지 않습니다. 연달아 완료하면 번호가 바뀌어 처음부터 다시 재생합니다. */
  const [wateringKey, setWateringKey] = useState<number | null>(null);
  const [bloomAfterWatering, setBloomAfterWatering] = useState(false);

  const close = () => setSheet(null);
  const openNew = () => {
    setEditing(null);
    setValue('');
    setFormDate(selectedDate);
    setRepeatDaily(false);
    setRepeatEndDate(addDays(selectedDate, DEFAULT_REPEAT_DAYS - 1));
    setFormError(null);
    setSheet('task');
  };
  const openActions = (task: DayTask) => { setActiveTask(task); setSheet('actions'); };
  const openEdit = () => {
    if (!activeTask) return;
    const isDaily = activeTask.kind === 'daily';
    setEditing(activeTask);
    setValue(activeTask.title);
    setFormDate(isDaily && activeTask.startDate ? activeTask.startDate : activeTask.date);
    setRepeatDaily(isDaily);
    setRepeatEndDate(activeTask.endDate ?? addDays(activeTask.date, DEFAULT_REPEAT_DAYS - 1));
    setFormError(null);
    setSheet('task');
  };
  const changeFormDate = (date: string) => {
    setFormDate(date);
    setFormError(null);
    // 시작일이 종료일과 같거나 뒤로 가면 종료일을 기본 기간으로 다시 잡습니다.
    if (repeatDaily && repeatEndDate <= date) setRepeatEndDate(addDays(date, DEFAULT_REPEAT_DAYS - 1));
  };
  const changeRepeatEndDate = (date: string) => { setRepeatEndDate(date); setFormError(null); };
  const requestDelete = () => {
    if (activeTask?.kind === 'daily') {
      setScopeAction('delete');
      setSheet('scope');
    } else {
      setSheet('delete');
    }
  };
  const confirmDelete = () => { if (activeTask) removeTask(activeTask, 'one'); setSheet(null); };
  const save = () => {
    const title = value.trim();
    if (!title) return;
    if (editing?.kind === 'daily') {
      if (formDate !== editing.startDate || repeatEndDate !== editing.endDate) {
        // 기간을 바꾸면 범위 선택 없이 반복 전체에 적용합니다.
        updateDailyPeriod(editing, title, formDate, repeatEndDate);
        setSheet(null);
        return;
      }
      // 제목만 바꾸면 어디까지 바꿀지 고른 뒤 반영합니다.
      setScopeAction('edit');
      setSheet('scope');
      return;
    }
    if (editing) {
      if (formDate !== editing.date && getDayTasks(tasks, dailyTasks, formDate).length >= DAILY_TASK_LIMIT) {
        setFormError(`${formatMonthDay(formDate)}에는 이미 ${DAILY_TASK_LIMIT}개가 있어요. 다른 날짜를 골라 주세요.`);
        return;
      }
      moveTask(editing, title, formDate);
    } else if (repeatDaily) addDailyTask(title, formDate, repeatEndDate);
    else addTask(title, formDate);
    setSheet(null);
  };
  const applyScope = (scope: EditScope) => {
    if (!activeTask) return;
    if (scopeAction === 'edit') editTask(activeTask, value.trim(), scope);
    else removeTask(activeTask, scope);
    setSheet(null);
  };
  const complete = (task: DayTask) => {
    const bloomed = toggleTask(task);
    if (task.completed) return; // 완료 취소에는 연출이 없습니다.
    // 완료하면 물 주기 연출을 먼저 보여주고, 꽃이 피었다면 연출이 끝난 뒤 개화 시트를 엽니다.
    if (bloomed) setBloomAfterWatering(true);
    setWateringKey((key) => (key ?? 0) + 1);
  };
  const finishWatering = () => {
    setWateringKey(null);
    if (bloomAfterWatering) {
      setBloomAfterWatering(false);
      setSheet('bloom');
    }
  };

  return {
    sheet, value, setValue, activeTask, isEditing: editing !== null,
    formDate, changeFormDate, formError,
    repeatDaily, setRepeatDaily, repeatEndDate, changeRepeatEndDate, scopeAction,
    wateringKey, finishWatering,
    close, openNew, openActions, openEdit, requestDelete, confirmDelete, save, applyScope, complete,
  };
}
