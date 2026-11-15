import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import * as api from '@/services/growMeApi';
import type { CollectionEntryResponse } from '@/types/api';

import type { DayTask, EditScope } from './taskSchedule';

/**
 * 할 일 변경 액션. 모든 변경은 서버(grow-me-back)에 저장하고, 성공하면 revision을 올려
 * 화면의 조회 훅(useGrowMeQueries)이 날짜별 할 일·달력·월간 진행·도감을 다시 불러오게 합니다.
 * 실패하면 ApiError를 그대로 던지므로 호출한 쪽에서 오류 문구를 보여줍니다.
 */
type GrowMeState = {
  /** 데이터 변경 횟수. 조회 훅이 이 값이 바뀌면 다시 불러옵니다. */
  revision: number;
  addTask: (title: string, date: string) => Promise<void>;
  addDailyTask: (title: string, startDate: string, endDate: string) => Promise<void>;
  editTask: (task: DayTask, title: string, scope: EditScope) => Promise<void>;
  /** 일반 할 일의 제목과 날짜를 바꿉니다. 완료 상태는 유지합니다. */
  moveTask: (task: DayTask, title: string, date: string) => Promise<void>;
  /** 반복 할 일 전체의 제목과 기간을 바꿉니다. 새 기간 밖의 완료·건너뜀 기록은 서버가 정리합니다. */
  updateDailyPeriod: (task: DayTask, title: string, startDate: string, endDate: string) => Promise<void>;
  removeTask: (task: DayTask, scope: EditScope) => Promise<void>;
  /** 완료 상태를 바꾸고, 이번 완료로 꽃이 피었으면 그 꽃 기록을, 아니면 null을 반환합니다. 개화 판정은 서버가 합니다. */
  toggleTask: (task: DayTask) => Promise<CollectionEntryResponse | null>;
};

const GrowMeContext = createContext<GrowMeState | null>(null);

export function GrowMeProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);

  const value = useMemo<GrowMeState>(() => {
    /** 서버 변경이 성공한 뒤 화면 데이터를 다시 불러오게 합니다. */
    const mutate = async <T,>(run: () => Promise<T>): Promise<T> => {
      const result = await run();
      setRevision((current) => current + 1);
      return result;
    };

    return {
      revision,
      addTask: (title, date) => mutate(async () => { await api.createTask(title, date); }),
      addDailyTask: (title, startDate, endDate) => mutate(async () => { await api.createDailyTask(title, startDate, endDate); }),
      editTask: (dayTask, title, scope) =>
        mutate(async () => {
          if (dayTask.kind === 'single') await api.updateTask(dayTask.sourceId, { title });
          else await api.renameOccurrence(dayTask.sourceId, dayTask.date, title, scope);
        }),
      moveTask: (dayTask, title, date) =>
        mutate(async () => {
          await api.updateTask(dayTask.sourceId, date === dayTask.date ? { title } : { title, date });
        }),
      updateDailyPeriod: (dayTask, title, startDate, endDate) =>
        mutate(async () => { await api.updateDailyTaskPeriod(dayTask.sourceId, title, startDate, endDate); }),
      removeTask: (dayTask, scope) =>
        mutate(async () => {
          if (dayTask.kind === 'single') await api.deleteTask(dayTask.sourceId);
          else await api.deleteOccurrence(dayTask.sourceId, dayTask.date, scope);
        }),
      toggleTask: (dayTask) =>
        mutate(async () => {
          const completed = !dayTask.completed;
          const result = dayTask.kind === 'single'
            ? await api.updateTask(dayTask.sourceId, { completed })
            : await api.changeOccurrenceCompletion(dayTask.sourceId, dayTask.date, completed);
          return result.bloomed ? result.bloom : null;
        }),
    };
  }, [revision]);

  return <GrowMeContext.Provider value={value}>{children}</GrowMeContext.Provider>;
}

export function useGrowMe() {
  const value = useContext(GrowMeContext);
  if (!value) throw new Error('useGrowMe must be used within GrowMeProvider');
  return value;
}

export type { DayTask, EditScope };
