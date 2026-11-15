// grow-me-back API 응답 타입. 날짜는 'YYYY-MM-DD', 연월은 'YYYY-MM' 문자열입니다.

import type { PlantStage } from '@/components/plants/plant.types';

/** 매일 반복 할 일 수정·삭제 범위: 이 날만(one) 또는 이 날 이후 모두(following) */
export type EditScope = 'one' | 'following';

/** 도감 정렬 */
export type CollectionSort = 'latest' | 'oldest';

/** 'done': 완료한 할 일이 하나라도 있음, 'pending': 할 일은 있지만 하나도 완료하지 않음 */
export type DateStatus = 'done' | 'pending';

/** 화면에 보이는 하루치 할 일 한 건(GET /v1/tasks). sourceId는 kind에 따라 tasks 또는 daily_tasks의 ID입니다. */
export type DayTaskResponse = {
  key: string;
  sourceId: number;
  kind: 'single' | 'daily';
  title: string;
  date: string;
  completed: boolean;
  /** kind가 'daily'일 때만 값이 있습니다. */
  startDate: string | null;
  endDate: string | null;
};

/** 달력 점 표시용 날짜 상태(GET /v1/tasks/statuses) */
export type DateStatusResponse = { date: string; status: DateStatus };

/** 도감 꽃 한 건. 번호들은 정렬과 관계없이 개화 순서 기준으로 서버가 계산합니다. */
export type CollectionEntryResponse = {
  id: number;
  flowerCode: string;
  flowerName: string;
  imageKey: string;
  bloomDate: string;
  month: string;
  completionCount: number;
  /** 도감 번호: 전체 개화 기록 중 몇 번째로 핀 꽃인지(1부터) */
  collectionNumber: number;
  /** 그달 몇 번째로 핀 꽃인지(1부터) */
  monthOrder: number;
  /** 달마다 번갈아 정하는 번호(0부터). 화면 이미지는 imageKey로 고르므로 현재는 쓰지 않습니다. */
  imageVariant: number;
};

/** 할 일 변경 응답. 이번 완료로 꽃이 피면 bloomed가 true입니다. */
export type TaskChangeResponse = {
  task: DayTaskResponse;
  bloomed: boolean;
  bloom: CollectionEntryResponse | null;
};

export type DailyTaskResponse = { id: number; title: string; startDate: string; endDate: string };

export type MonthlyProgressResponse = {
  month: string;
  completionCount: number;
  stage: PlantStage;
  bloomCount: number;
  remainingToNextBloom: number;
  /** 그달 첫 개화 전이면 null */
  flower: { code: string; name: string; imageKey: string } | null;
};

/** 공통 오류 응답 */
export type ErrorResponse = {
  code: string;
  message: string;
  fieldErrors: { field: string; message: string }[];
};
