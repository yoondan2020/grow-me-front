// grow-me-back 엔드포인트별 요청 함수. 화면은 이 함수를 직접 부르지 않고 GrowMeContext 액션과 조회 훅을 통해 사용합니다.

import type {
  CollectionEntryResponse,
  CollectionSort,
  DailyTaskResponse,
  DateStatusResponse,
  DayTaskResponse,
  EditScope,
  MonthlyProgressResponse,
  TaskChangeResponse,
} from '@/types/api';

import { request } from './apiClient';

// 날짜별 할 일 (tasks)

export const fetchDayTasks = (date: string) => request<DayTaskResponse[]>('/v1/tasks', { query: { date } });

export const fetchDateStatuses = (from: string, to: string) =>
  request<DateStatusResponse[]>('/v1/tasks/statuses', { query: { from, to } });

export const createTask = (title: string, date: string) =>
  request<DayTaskResponse>('/v1/tasks', { method: 'POST', body: { title, date } });

/** 바꿀 값만 보냅니다. */
export const updateTask = (taskId: number, changes: { title?: string; date?: string; completed?: boolean }) =>
  request<TaskChangeResponse>(`/v1/tasks/${taskId}`, { method: 'PATCH', body: changes });

export const deleteTask = (taskId: number) => request<void>(`/v1/tasks/${taskId}`, { method: 'DELETE' });

// 매일 반복 할 일 (daily-tasks)

export const createDailyTask = (title: string, startDate: string, endDate: string) =>
  request<DailyTaskResponse>('/v1/daily-tasks', { method: 'POST', body: { title, startDate, endDate } });

/** 반복 전체의 제목·시작일·종료일 변경 */
export const updateDailyTaskPeriod = (dailyTaskId: number, title: string, startDate: string, endDate: string) =>
  request<DailyTaskResponse>(`/v1/daily-tasks/${dailyTaskId}`, { method: 'PATCH', body: { title, startDate, endDate } });

export const changeOccurrenceCompletion = (dailyTaskId: number, date: string, completed: boolean) =>
  request<TaskChangeResponse>(`/v1/daily-tasks/${dailyTaskId}/occurrences/${date}`, { method: 'PATCH', body: { completed } });

export const renameOccurrence = (dailyTaskId: number, date: string, title: string, scope: EditScope) =>
  request<TaskChangeResponse>(`/v1/daily-tasks/${dailyTaskId}/occurrences/${date}`, { method: 'PATCH', body: { title, scope } });

export const deleteOccurrence = (dailyTaskId: number, date: string, scope: EditScope) =>
  request<void>(`/v1/daily-tasks/${dailyTaskId}/occurrences/${date}`, { method: 'DELETE', query: { scope } });

// 월간 진행 (progress)

export const fetchMonthlyProgress = (month: string) =>
  request<MonthlyProgressResponse>('/v1/progress/monthly', { query: { month } });

// 도감 (collection)

export const fetchCollection = (sort: CollectionSort) =>
  request<CollectionEntryResponse[]>('/v1/collection', { query: { sort } });

export const fetchCollectionEntry = (bloomId: string) =>
  request<CollectionEntryResponse>(`/v1/collection/${encodeURIComponent(bloomId)}`);
