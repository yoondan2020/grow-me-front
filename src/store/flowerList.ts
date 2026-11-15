import type { CollectionEntryResponse, CollectionSort } from '@/types/api';

export type FlowerSort = CollectionSort;

/** 도감에 표시할 꽃 한 건. 도감 번호·그달 순서·이미지 번호는 서버가 개화 순서로 계산해 정렬과 상관없이 고정됩니다. */
export type FlowerEntry = CollectionEntryResponse;

export type FlowerYearSection = { year: string; entries: FlowerEntry[] };

/**
 * 개화 순서(오래된순)로 받은 꽃 기록을 연도별 구역으로 나눕니다.
 * 연도 순서와 구역 안 순서 모두 정렬 방향을 따릅니다.
 */
export function groupFlowersByYear(entriesInBloomOrder: FlowerEntry[], sort: FlowerSort): FlowerYearSection[] {
  const entries = sort === 'latest' ? [...entriesInBloomOrder].reverse() : entriesInBloomOrder;

  const sections: FlowerYearSection[] = [];
  for (const entry of entries) {
    const year = entry.bloomDate.slice(0, 4);
    const last = sections[sections.length - 1];
    if (last?.year === year) last.entries.push(entry);
    else sections.push({ year, entries: [entry] });
  }
  return sections;
}
