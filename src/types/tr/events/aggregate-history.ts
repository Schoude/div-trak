export interface Ticker {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
  adjValue: string | null;
}

export interface AggregateHistory {
  aggregates: Ticker[];
  resolution: number;
  lastAggregateEndTime: number;
  expectedClosingTime: number;
}
