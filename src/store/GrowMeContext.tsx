import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import { addDays, monthKey } from '@/utils/date';

import { countMonthCompletions, type DailyTask, type DayTask, type EditScope, type GrowTask } from './taskSchedule';

type FlowerRecord = { id: string; name: string; date: string; month: string; completions: number };
type GrowMeState = {
  tasks: GrowTask[];
  dailyTasks: DailyTask[];
  flowers: FlowerRecord[];
  addTask: (title: string, date: string) => void;
  addDailyTask: (title: string, startDate: string, endDate: string) => void;
  editTask: (task: DayTask, title: string, scope: EditScope) => void;
  /** 일반 할 일의 제목과 날짜를 바꿉니다. 완료 상태는 유지합니다. */
  moveTask: (task: DayTask, title: string, date: string) => void;
  /** 반복 할 일 전체의 제목과 기간을 바꿉니다. 새 기간 밖의 완료·건너뜀 기록은 정리합니다. */
  updateDailyPeriod: (task: DayTask, title: string, startDate: string, endDate: string) => void;
  removeTask: (task: DayTask, scope: EditScope) => void;
  /** 완료 상태를 바꾸고, 이번 완료로 꽃이 피었으면 true를 반환합니다. */
  toggleTask: (task: DayTask) => boolean;
};

const GrowMeContext = createContext<GrowMeState | null>(null);

function createId() {
  return `${Date.now()}-${Math.random()}`;
}

/** 반복을 date 전날까지로 줄이고, date 이후의 건너뜀·완료 기록을 정리합니다. */
function endDailyBefore(task: DailyTask, date: string): DailyTask {
  return {
    ...task,
    endDate: addDays(date, -1),
    skippedDates: task.skippedDates.filter((item) => item < date),
    completedDates: task.completedDates.filter((item) => item < date),
  };
}

export function GrowMeProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<GrowTask[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [flowers, setFlowers] = useState<FlowerRecord[]>([]);
  // 화면이 다시 그려지기 전에 연달아 완료해도 완료 수를 정확히 세도록, 최신 상태를 ref에 바로 반영합니다.
  const tasksRef = useRef<GrowTask[]>([]);
  const dailyTasksRef = useRef<DailyTask[]>([]);
  const flowersRef = useRef<FlowerRecord[]>([]);

  const value = useMemo<GrowMeState>(() => {
    const updateTasks = (update: (current: GrowTask[]) => GrowTask[]) => {
      tasksRef.current = update(tasksRef.current);
      setTasks(tasksRef.current);
    };
    const updateDailyTasks = (update: (current: DailyTask[]) => DailyTask[]) => {
      dailyTasksRef.current = update(dailyTasksRef.current);
      setDailyTasks(dailyTasksRef.current);
    };
    const updateFlowers = (update: (current: FlowerRecord[]) => FlowerRecord[]) => {
      flowersRef.current = update(flowersRef.current);
      setFlowers(flowersRef.current);
    };
    const updateDaily = (id: string, update: (task: DailyTask) => DailyTask[]) =>
      updateDailyTasks((current) => current.flatMap((task) => (task.id === id ? update(task) : [task])));

    return {
      tasks,
      dailyTasks,
      flowers,
      addTask: (title, date) => updateTasks((current) => [...current, { id: createId(), title, date, completed: false }]),
      addDailyTask: (title, startDate, endDate) =>
        updateDailyTasks((current) => [...current, { id: createId(), title, startDate, endDate, skippedDates: [], completedDates: [] }]),
      editTask: (dayTask, title, scope) => {
        if (dayTask.kind === 'single') {
          updateTasks((current) => current.map((task) => (task.id === dayTask.sourceId ? { ...task, title } : task)));
          return;
        }
        if (scope === 'one') {
          // 그날만 반복에서 빼고, 같은 완료 상태의 단일 할 일로 바꿉니다.
          updateDaily(dayTask.sourceId, (task) => [{
            ...task,
            skippedDates: [...task.skippedDates, dayTask.date],
            completedDates: task.completedDates.filter((date) => date !== dayTask.date),
          }]);
          updateTasks((current) => [...current, { id: createId(), title, date: dayTask.date, completed: dayTask.completed }]);
          return;
        }
        updateDaily(dayTask.sourceId, (task) => {
          if (dayTask.date === task.startDate) return [{ ...task, title }];
          const following: DailyTask = {
            id: createId(),
            title,
            startDate: dayTask.date,
            endDate: task.endDate,
            skippedDates: task.skippedDates.filter((date) => date >= dayTask.date),
            completedDates: task.completedDates.filter((date) => date >= dayTask.date),
          };
          return [endDailyBefore(task, dayTask.date), following];
        });
      },
      moveTask: (dayTask, title, date) =>
        updateTasks((current) => current.map((task) => (task.id === dayTask.sourceId ? { ...task, title, date } : task))),
      updateDailyPeriod: (dayTask, title, startDate, endDate) => {
        const inRange = (date: string) => startDate <= date && date <= endDate;
        updateDaily(dayTask.sourceId, (task) => [{
          ...task,
          title,
          startDate,
          endDate,
          skippedDates: task.skippedDates.filter(inRange),
          completedDates: task.completedDates.filter(inRange),
        }]);
      },
      removeTask: (dayTask, scope) => {
        if (dayTask.kind === 'single') {
          updateTasks((current) => current.filter((task) => task.id !== dayTask.sourceId));
          return;
        }
        if (scope === 'one') {
          updateDaily(dayTask.sourceId, (task) => [{
            ...task,
            skippedDates: [...task.skippedDates, dayTask.date],
            completedDates: task.completedDates.filter((date) => date !== dayTask.date),
          }]);
          return;
        }
        updateDaily(dayTask.sourceId, (task) => (dayTask.date === task.startDate ? [] : [endDailyBefore(task, dayTask.date)]));
      },
      toggleTask: (dayTask) => {
        const nextCompleted = !dayTask.completed;
        if (dayTask.kind === 'single') {
          updateTasks((current) => current.map((task) => (task.id === dayTask.sourceId ? { ...task, completed: nextCompleted } : task)));
        } else {
          updateDaily(dayTask.sourceId, (task) => [{
            ...task,
            completedDates: nextCompleted
              ? [...task.completedDates, dayTask.date]
              : task.completedDates.filter((date) => date !== dayTask.date),
          }]);
        }
        if (!nextCompleted) return false;
        const month = monthKey(dayTask.date);
        // 방금 반영한 완료까지 포함한 최신 상태로 셉니다.
        const count = countMonthCompletions(tasksRef.current, dailyTasksRef.current, month);
        const isBloomCount = count >= 20 && (count - 20) % 10 === 0;
        // 완료 취소 후 다시 완료하는 등으로 같은 달·같은 완료 수에 다시 도달하면 이미 핀 꽃으로 보고 새로 만들지 않습니다.
        const alreadyBloomed = flowersRef.current.some((flower) => flower.month === month && flower.completions === count);
        if (isBloomCount && !alreadyBloomed) {
          const record: FlowerRecord = {
            id: `${month}-${Date.now()}`,
            name: count === 20 ? '이달의 데이지' : '이달의 꽃',
            date: dayTask.date,
            month,
            completions: count,
          };
          updateFlowers((current) => [...current, record]);
          return true;
        }
        return false;
      },
    };
  }, [tasks, dailyTasks, flowers]);

  return <GrowMeContext.Provider value={value}>{children}</GrowMeContext.Provider>;
}

export function useGrowMe() {
  const value = useContext(GrowMeContext);
  if (!value) throw new Error('useGrowMe must be used within GrowMeProvider');
  return value;
}

export type { DailyTask, DayTask, EditScope, FlowerRecord, GrowTask };
