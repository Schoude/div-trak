import type { InstrumentEvent } from './events/instruments';
import type { StockDetailsEvent } from './events/stock-details';
// import type { TickerEvent } from './events/ticker';

export interface Instrument {
  instrument: InstrumentEvent;
  stockDetails: StockDetailsEvent;
  tickerEventId: number;
}

export type Sentiment = 'sentiment-bullish' | 'sentiment-bearish';

export interface InstrumentFilled extends Instrument {
  amount: number;
  value: number;
  valueFormatted: string;
  priceBid: string;
  sentimentIntraDay: Sentiment;
}
