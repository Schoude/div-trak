import type { Tag } from '@/types/tr/events/instruments';

export interface SectorData {
  sector: Tag;
  instruments: { name: string }[];
}

export interface TreemapStructure {
  name: string;
  count: number;
  children?: {
    name: string;
    count: number;
  }[];
}
