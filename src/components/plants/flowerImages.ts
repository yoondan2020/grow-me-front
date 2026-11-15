/** 도감 꽃 이미지. 도감 목록과 꽃 상세가 같은 이미지 번호(imageVariant)로 같은 그림을 보여줍니다. */
const FLOWER_IMAGES = [
  require('@/assets/images/growme/flower-daisy.png'),
  require('@/assets/images/growme/flower-bluebell.png'),
];

export function getFlowerImage(imageVariant: number) {
  return FLOWER_IMAGES[imageVariant % FLOWER_IMAGES.length];
}
