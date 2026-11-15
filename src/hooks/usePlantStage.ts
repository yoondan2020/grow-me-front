import type { PlantStage } from '@/components/plants/plant.types';
import { todayKey } from '@/utils/date';

import { useMonthlyProgress } from './useGrowMeQueries';

/** 이번 달 식물 상태. flowerKey는 꽃봉오리 단계(완료 15개)에 정해진 이달의 꽃 image_key이며, 그 전에는 null입니다. */
export type PlantState = { stage: PlantStage; flowerKey: string | null };

/**
 * 이번 달 식물 단계와 이달의 꽃. 서버가 월간 완료 수로 계산합니다(0–4 씨앗, 5–9 새싹, 10–14 성장, 15–19 꽃봉오리, 20 이상 개화).
 * 처음 불러오는 중에는 null이고, 불러오지 못하면 씨앗으로 보여줍니다.
 */
export function usePlantStage(): PlantState | null {
  const { data, error } = useMonthlyProgress(todayKey());
  if (data) return { stage: data.stage, flowerKey: data.flower?.imageKey ?? null };
  return error ? { stage: 'seed', flowerKey: null } : null;
}
