import { addDays, monthKey } from '@/utils/date';

/** 하루에 등록할 수 있는 할 일 수(매일 반복 할 일 포함) */
export const DAILY_TASK_LIMIT = 5;

/** 특정 날짜 하루만의 할 일 */
export type GrowTask = { id: string; title: string; date: string; completed: boolean };

/** startDate부터 endDate까지(포함) 매일 나타나는 할 일 */
export type DailyTask = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  /** '이 날만' 수정·삭제로 반복에서 빠진 날짜 */
  skippedDates: string[];
  completedDates: string[];
};

/** 화면에 보이는 하루치 할 일 한 건 */
export type DayTask = {
  key: string;
  sourceId: string;
  kind: 'single' | 'daily';
  title: string;
  date: string;
  completed: boolean;
  /** kind가 'daily'일 때 반복 시작일·종료일 */
  startDate?: string;
  endDate?: string;
};

export type EditScope = 'one' | 'following';

function isDailyActiveOn(task: DailyTask, date: string) {
  return task.startDate <= date && date <= task.endDate && !task.skippedDates.includes(date);
}

/**
 * 날짜별 할 일 목록. 단일 할 일을 먼저, 매일 반복 할 일을 등록 순으로 붙이고 하루 한도까지만 보여줍니다.
 * 한도가 이미 찬 날에는 그날만 반복 할 일이 나타나지 않습니다.
 */
export function getDayTasks(tasks: GrowTask[], dailyTasks: DailyTask[], date: string): DayTask[] {
  const singles: DayTask[] = tasks
    .filter((task) => task.date === date)
    .map((task) => ({ key: task.id, sourceId: task.id, kind: 'single', title: task.title, date, completed: task.completed }));
  const dailies: DayTask[] = dailyTasks
    .filter((task) => isDailyActiveOn(task, date))
    .map((task) => ({
      key: `${task.id}@${date}`,
      sourceId: task.id,
      kind: 'daily',
      title: task.title,
      date,
      completed: task.completedDates.includes(date),
      startDate: task.startDate,
      endDate: task.endDate,
    }));
  return [...singles, ...dailies].slice(0, DAILY_TASK_LIMIT);
}

/** 화면에 보이는 할 일 중 완료한 항목이 하나라도 있는 날짜 */
export function getCompletedDates(tasks: GrowTask[], dailyTasks: DailyTask[]): string[] {
  const candidates = new Set<string>();
  for (const task of tasks) if (task.completed) candidates.add(task.date);
  for (const task of dailyTasks) for (const date of task.completedDates) candidates.add(date);
  return [...candidates].filter((date) => getDayTasks(tasks, dailyTasks, date).some((task) => task.completed));
}

/** 'done': 완료한 할 일이 하나라도 있음, 'pending': 할 일은 있지만 하나도 완료하지 않음 */
export type DateStatus = 'done' | 'pending';

/** 화면에 보이는 할 일이 있는 날짜별 완료 상태(달력 점 표시용) */
export function getDateStatuses(tasks: GrowTask[], dailyTasks: DailyTask[]): Record<string, DateStatus> {
  const candidates = new Set<string>();
  for (const task of tasks) candidates.add(task.date);
  for (const task of dailyTasks) {
    for (let date = task.startDate; date <= task.endDate; date = addDays(date, 1)) candidates.add(date);
  }
  const statuses: Record<string, DateStatus> = {};
  for (const date of candidates) {
    const dayTasks = getDayTasks(tasks, dailyTasks, date);
    if (dayTasks.length === 0) continue;
    statuses[date] = dayTasks.some((task) => task.completed) ? 'done' : 'pending';
  }
  return statuses;
}

/** 해당 월('YYYY-MM')의 완료 수 */
export function countMonthCompletions(tasks: GrowTask[], dailyTasks: DailyTask[], month: string): number {
  return getCompletedDates(tasks, dailyTasks)
    .filter((date) => monthKey(date) === month)
    .reduce((sum, date) => sum + getDayTasks(tasks, dailyTasks, date).filter((task) => task.completed).length, 0);
}
