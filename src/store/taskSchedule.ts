// 날짜별 할 일 목록·하루 한도·달력 상태·월간 완료 수는 서버(grow-me-back DayScheduleService)가 계산합니다.
// 이 파일은 화면에서 쓰는 할 일 타입과 조회 범위 계산만 둡니다.

import type { DateStatus, DateStatusResponse, DayTaskResponse, EditScope } from '@/types/api';
import { addDays, endOfMonthKey, startOfMonthKey } from '@/utils/date';

/** 하루에 등록할 수 있는 할 일 수(매일 반복 할 일 포함). 서버도 같은 한도로 검사합니다. */
export const DAILY_TASK_LIMIT = 5;

/** 화면에 보이는 하루치 할 일 한 건 */
export type DayTask = DayTaskResponse;

export type { DateStatus, EditScope };

/** 달력 점 표시 범위: 그달 앞뒤로 한 주씩 넓혀, 주간 달력이 달 경계를 넘어도 점이 보이게 합니다(서버 최대 100일). */
export function getStatusRange(dateKey: string): { from: string; to: string } {
  return { from: addDays(startOfMonthKey(dateKey), -7), to: addDays(endOfMonthKey(dateKey), 7) };
}

/** 서버 응답을 달력에서 쓰는 날짜별 상태 맵으로 바꿉니다. */
export function toDateStatusMap(statuses: DateStatusResponse[]): Record<string, DateStatus> {
  return Object.fromEntries(statuses.map(({ date, status }) => [date, status]));
}
