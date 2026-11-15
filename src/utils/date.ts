// 날짜는 기기 현지 시간 기준의 'YYYY-MM-DD' 문자열(dateKey)로 다룹니다.

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** 'YYYY-MM' */
export function monthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

/** 예: 11월 14일 금요일 */
export function formatMonthDayWeekday(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}

/** 예: 2026년 11월 14일 */
export function formatFullDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** 예: 11월 21일 */
export function formatMonthDay(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
