import type { FlowerRecord } from './GrowMeContext';

export type FlowerSort = 'latest' | 'oldest';

/** 도감에 표시할 꽃 한 건. 번호와 이미지는 정렬과 상관없이 개화 기록 기준으로 고정됩니다. */
export type FlowerEntry = {
  flower: FlowerRecord;
  /** 도감 번호: 전체 개화 기록 중 몇 번째로 핀 꽃인지(1부터) */
  collectionNumber: number;
  /** 그달 몇 번째로 핀 꽃인지(1부터) */
  monthOrder: number;
  /** 같은 달 꽃은 같은 종류이므로 달마다 번갈아 정하는 이미지 번호 */
  imageVariant: number;
};

export type FlowerYearSection = { year: string; entries: FlowerEntry[] };

/** 개화일 오름차순. 같은 날이면 월 완료 수가 적은(먼저 핀) 꽃이 앞입니다. */
function compareOldestFirst(a: FlowerRecord, b: FlowerRecord) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  return a.completions - b.completions;
}

/** 개화 순서(오래된순)로 정렬한 도감 항목 */
export function getFlowerEntries(flowers: FlowerRecord[]): FlowerEntry[] {
  const monthCounts = new Map<string, number>();
  const monthVariants = new Map<string, number>();
  return [...flowers].sort(compareOldestFirst).map((flower, index) => {
    const monthOrder = (monthCounts.get(flower.month) ?? 0) + 1;
    monthCounts.set(flower.month, monthOrder);
    if (!monthVariants.has(flower.month)) monthVariants.set(flower.month, monthVariants.size);
    return { flower, collectionNumber: index + 1, monthOrder, imageVariant: monthVariants.get(flower.month) ?? 0 };
  });
}

/** id로 도감 항목 하나를 찾습니다. 없으면 null입니다. */
export function findFlowerEntry(flowers: FlowerRecord[], id: string | undefined): FlowerEntry | null {
  if (!id) return null;
  return getFlowerEntries(flowers).find((entry) => entry.flower.id === id) ?? null;
}

/** 꽃 기록을 연도별 구역으로 나눕니다. 연도 순서와 구역 안 순서 모두 정렬 방향을 따릅니다. */
export function groupFlowersByYear(flowers: FlowerRecord[], sort: FlowerSort): FlowerYearSection[] {
  const entries = getFlowerEntries(flowers);
  if (sort === 'latest') entries.reverse();

  const sections: FlowerYearSection[] = [];
  for (const entry of entries) {
    const year = entry.flower.date.slice(0, 4);
    const last = sections[sections.length - 1];
    if (last?.year === year) last.entries.push(entry);
    else sections.push({ year, entries: [entry] });
  }
  return sections;
}
