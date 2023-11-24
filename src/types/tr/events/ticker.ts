// Generated by https://quicktype.io

export interface TickerEvent {
  bid: Quote;
  ask: Quote;
  last: Quote;
  pre: Quote;
  open: Quote;
  qualityId: string;
}

export interface Quote {
  time: number;
  price: string;
  size: number;
}
