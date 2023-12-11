import type { Tag } from '@/types/tr/events/instruments';

export interface SectorData {
  sector: Tag;
  instruments: Instrument;
}

export interface TreemapStructure {
  name: string;
  count: number;
  children?: {
    name: string,
    count: number;
  }[];
}
