/**
 * 꽃 종류별 이미지. 키는 서버 꽃 후보의 image_key(flower_candidates.image_key)와 같습니다.
 * 이달의 꽃은 꽃봉오리 단계(그달 완료 15개)에 정해지므로, 꽃마다 꽃봉오리·개화 이미지만 따로 두고
 * 씨앗·새싹·성장 단계는 모든 꽃이 공용 이미지(PlantArt)를 씁니다.
 *
 * 꽃 추가 방법: 같은 캔버스(PlantArt의 PLANT_CANVAS) 규격의 꽃봉오리·개화 이미지를 assets/images/growme에 넣고
 * 아래에 한 줄을 추가한 뒤, grow-me-back에 같은 image_key로 꽃 후보를 넣는 Flyway 마이그레이션을 추가합니다.
 */
export type FlowerImageSet = { bud: number; bloom: number };

/** 이달의 꽃이 아직 없거나 모르는 키일 때 쓰는 꽃 */
export const DEFAULT_FLOWER_KEY = 'camellia';

const FLOWER_IMAGES: Record<string, FlowerImageSet> = {
  camellia: {
    bud: require('@/assets/images/growme/plant-stage-bud.png'),
    bloom: require('@/assets/images/growme/plant-stage-bloom.png'),
  },
};

export function getFlowerImages(imageKey: string | null | undefined): FlowerImageSet {
  return (imageKey ? FLOWER_IMAGES[imageKey] : undefined) ?? FLOWER_IMAGES[DEFAULT_FLOWER_KEY];
}
