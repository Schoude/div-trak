export type RangeHistory =
  | '1d' // 10m
  | '5d' // 60m
  | '1m' // 4h
  | '6m' // 1d
  | '1y' // 1d
  | 'max'; // 7d

export interface Ticker {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
  adjValue: string | null;
}

export interface AggregateHistoryEvent {
  aggregates: Ticker[];
  resolution: number;
  lastAggregateEndTime: number;
  expectedClosingTime: number;
}
