import type { PlantStage } from '@/components/plants/plant.types';
import { todayKey } from '@/utils/date';

import { useMonthlyProgress } from './useGrowMeQueries';

/**
 * 이번 달 식물 단계. 서버가 월간 완료 수로 계산합니다(0–4 씨앗, 5–9 새싹, 10–14 성장, 15–19 꽃봉오리, 20 이상 개화).
 * 처음 불러오는 중에는 null이고, 불러오지 못하면 씨앗으로 보여줍니다.
 */
export function usePlantStage(): PlantStage | null {
  const { data, error } = useMonthlyProgress(todayKey());
  if (data) return data.stage;
  return error ? 'seed' : null;
}
