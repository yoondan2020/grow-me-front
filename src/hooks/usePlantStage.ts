import type { PlantStage } from '@/components/plants/plant.types';
import { useGrowMe } from '@/store/GrowMeContext';
import { countMonthCompletions } from '@/store/taskSchedule';
import { monthKey, todayKey } from '@/utils/date';

export function usePlantStage(): PlantStage {
  const { tasks, dailyTasks, flowers } = useGrowMe();
  if (flowers.length > 0) return 'garden';
  const completedThisMonth = countMonthCompletions(tasks, dailyTasks, monthKey(todayKey()));
  return completedThisMonth >= 5 ? 'bud' : 'sprout';
}
