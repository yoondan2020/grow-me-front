import type { PlantStage } from '@/components/plants/plant.types';
import { useGrowMe } from '@/store/GrowMeContext';
import { countMonthCompletions } from '@/store/taskSchedule';
import { monthKey, todayKey } from '@/utils/date';

/** PRD 월간 성장 기준: 0–4 씨앗, 5–9 새싹, 10–14 성장, 15–19 꽃봉오리, 20 이상 개화. */
export function getPlantStage(monthCompletions: number): PlantStage {
  if (monthCompletions >= 20) return 'bloom';
  if (monthCompletions >= 15) return 'bud';
  if (monthCompletions >= 10) return 'growth';
  if (monthCompletions >= 5) return 'sprout';
  return 'seed';
}

export function usePlantStage(): PlantStage {
  const { tasks, dailyTasks } = useGrowMe();
  return getPlantStage(countMonthCompletions(tasks, dailyTasks, monthKey(todayKey())));
}
