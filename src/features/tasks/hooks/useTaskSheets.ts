import { useState } from 'react';

import { ApiError } from '@/services/apiClient';
import type { FlowerEntry } from '@/store/flowerList';
import { useGrowMe, type DayTask, type EditScope } from '@/store/GrowMeContext';
import { DAILY_TASK_LIMIT } from '@/store/taskSchedule';
import { addDays, formatMonthDay } from '@/utils/date';

export type TaskSheet = 'task' | 'actions' | 'delete' | 'scope' | 'bloom' | null;
export type ScopeAction = 'edit' | 'delete';

/** 매일 반복을 켰을 때 기본 종료일: 시작일 포함 7일 */
const DEFAULT_REPEAT_DAYS = 7;

export function useTaskSheets(selectedDate: string) {
  const { addTask, addDailyTask, editTask, moveTask, updateDailyPeriod, removeTask, toggleTask } = useGrowMe();
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
  /** 방금 핀 꽃. 물 주기 연출이 끝나면 개화 시트로 보여줍니다. */
  const [bloomedFlower, setBloomedFlower] = useState<FlowerEntry | null>(null);
  const [bloomAfterWatering, setBloomAfterWatering] = useState(false);
  /** 서버에 저장하는 중. 중복 요청을 막습니다. */
  const [saving, setSaving] = useState(false);
  /** 시트 밖에서 일어난 변경(완료·삭제·범위 수정)의 서버 오류 */
  const [actionError, setActionError] = useState<unknown>(null);

  /** 서버 변경을 한 번에 하나씩 실행합니다. 실패하면 onError로 넘기고 false를 반환합니다. */
  const runSaving = async (run: () => Promise<void>, onError: (error: unknown) => void) => {
    if (saving) return false;
    setSaving(true);
    try {
      await run();
      return true;
    } catch (error) {
      onError(error);
      return false;
    } finally {
      setSaving(false);
    }
  };

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
  const confirmDelete = async () => {
    if (!activeTask) return;
    setSheet(null);
    await runSaving(() => removeTask(activeTask, 'one'), setActionError);
  };
  /** 시트 안 저장 오류 문구. 다른 날짜로 옮기다 한도에 걸리면 날짜를 넣어 안내합니다. */
  const showFormError = (error: unknown) => {
    if (error instanceof ApiError && error.code === 'DAILY_LIMIT_EXCEEDED' && editing && formDate !== editing.date) {
      setFormError(`${formatMonthDay(formDate)}에는 이미 ${DAILY_TASK_LIMIT}개가 있어요. 다른 날짜를 골라 주세요.`);
      return;
    }
    setFormError(error instanceof Error ? error.message : '저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
  };
  const save = async () => {
    const title = value.trim();
    if (!title) return;
    if (editing?.kind === 'daily' && formDate === editing.startDate && repeatEndDate === editing.endDate) {
      // 제목만 바꾸면 어디까지 바꿀지 고른 뒤 반영합니다.
      setScopeAction('edit');
      setSheet('scope');
      return;
    }
    const saved = await runSaving(async () => {
      // 반복 할 일의 기간을 바꾸면 범위 선택 없이 반복 전체에 적용합니다.
      if (editing?.kind === 'daily') await updateDailyPeriod(editing, title, formDate, repeatEndDate);
      else if (editing) await moveTask(editing, title, formDate);
      else if (repeatDaily) await addDailyTask(title, formDate, repeatEndDate);
      else await addTask(title, formDate);
    }, showFormError);
    if (saved) setSheet(null);
  };
  const applyScope = async (scope: EditScope) => {
    if (!activeTask) return;
    setSheet(null);
    const action = scopeAction === 'edit' ? () => editTask(activeTask, value.trim(), scope) : () => removeTask(activeTask, scope);
    await runSaving(action, setActionError);
  };
  const complete = async (task: DayTask) => {
    let bloomed: FlowerEntry | null = null;
    const saved = await runSaving(async () => { bloomed = await toggleTask(task); }, setActionError);
    if (!saved || task.completed) return; // 실패하거나 완료 취소면 연출이 없습니다.
    // 완료하면 물 주기 연출을 먼저 보여주고, 꽃이 피었다면 연출이 끝난 뒤 개화 시트를 엽니다.
    if (bloomed) {
      setBloomedFlower(bloomed);
      setBloomAfterWatering(true);
    }
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
    wateringKey, finishWatering, saving, bloomedFlower,
    actionError, dismissActionError: () => setActionError(null),
    close, openNew, openActions, openEdit, requestDelete, confirmDelete, save, applyScope, complete,
  };
}
