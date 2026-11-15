import { useEffect, useState } from 'react';

import * as api from '@/services/growMeApi';
import { useGrowMe } from '@/store/GrowMeContext';
import { getStatusRange, toDateStatusMap } from '@/store/taskSchedule';
import { monthKey } from '@/utils/date';

export type ApiQuery<T> = {
  /** 아직 받지 못했거나 다른 조건(key)의 데이터만 있으면 undefined */
  data: T | undefined;
  error: unknown;
  /** 이 조건의 데이터를 처음 불러오는 중 */
  loading: boolean;
  reload: () => void;
};

type QueryState<T> = { key: string | null; data: T | undefined; error: unknown };

/**
 * 서버 조회 공통 훅. key가 바뀌거나 데이터가 변경(revision)되면 다시 불러옵니다.
 * 같은 key를 다시 불러오는 동안에는 이전 데이터를 유지해 화면이 깜빡이지 않게 합니다.
 * key가 null이면 요청하지 않습니다.
 */
function useApiQuery<T>(key: string | null, fetcher: () => Promise<T>): ApiQuery<T> {
  const { revision } = useGrowMe();
  const [state, setState] = useState<QueryState<T>>({ key: null, data: undefined, error: null });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (key === null) return;
    let active = true;
    fetcher().then(
      (data) => { if (active) setState({ key, data, error: null }); },
      (error: unknown) => {
        if (active) setState((prev) => ({ key, data: prev.key === key ? prev.data : undefined, error }));
      },
    );
    return () => { active = false; };
    // fetcher는 key로 정해지는 요청이므로 key·revision·retry가 바뀔 때만 다시 요청합니다.
  }, [key, revision, retry]);

  const isCurrent = key !== null && state.key === key;
  return {
    data: isCurrent ? state.data : undefined,
    error: isCurrent ? state.error : null,
    loading: key !== null && !isCurrent,
    reload: () => setRetry((count) => count + 1),
  };
}

/** 날짜별 할 일(매일 반복 포함, 최대 5개) */
export function useDayTasks(date: string) {
  return useApiQuery(`tasks:${date}`, () => api.fetchDayTasks(date));
}

/** dateKey가 속한 달(앞뒤 한 주 포함)의 달력 점 상태 */
export function useDateStatuses(dateKey: string) {
  const { from, to } = getStatusRange(dateKey);
  return useApiQuery(`statuses:${from}:${to}`, async () => toDateStatusMap(await api.fetchDateStatuses(from, to)));
}

/** 월간 진행과 식물 단계. dateKey가 속한 달을 조회합니다. */
export function useMonthlyProgress(dateKey: string) {
  const month = monthKey(dateKey);
  return useApiQuery(`progress:${month}`, () => api.fetchMonthlyProgress(month));
}

/** 도감 전체를 개화 순서(오래된순)로 조회합니다. 화면의 정렬 전환은 store/flowerList.ts에서 처리합니다. */
export function useCollection() {
  return useApiQuery('collection', () => api.fetchCollection('oldest'));
}

/** 꽃 상세 */
export function useCollectionEntry(bloomId: string | undefined) {
  return useApiQuery(bloomId ? `collection:${bloomId}` : null, () => api.fetchCollectionEntry(bloomId ?? ''));
}
