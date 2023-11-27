import type { InstrumentEvent } from './events/instruments';
import type { StockDetailsEvent } from './events/stock-details';

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

export type Stock = Instrument;
export type ETF = Omit<Instrument, 'stockDetails'>;
export type StockFilled = InstrumentFilled;
export type ETFFilled = Omit<InstrumentFilled, 'stockDetails'>;

export function isStock (instrument: Partial<Instrument>): instrument is Stock {
  return instrument.instrument?.typeId == 'stock';
}

export function isETF (instrument: Partial<Instrument>): instrument is ETF {
  return instrument.instrument?.typeId == 'fund';
}
