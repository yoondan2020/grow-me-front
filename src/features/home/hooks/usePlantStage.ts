import type { PlantStage } from '@/components/plants/plant.types';
import { useGrowMe } from '@/store/GrowMeContext';

export function usePlantStage(): PlantStage {
  const { tasks, flowers } = useGrowMe();
  if (flowers.length > 0) return 'garden';
  const completedThisMonth = tasks.filter((task) => task.date.startsWith('2026-11') && task.completed).length;
  return completedThisMonth >= 5 ? 'bud' : 'sprout';
}
