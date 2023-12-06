import type { ETFDetailsEvent } from '@/types/tr/events/etf-details';
import type { InstrumentEvent } from '@/types/tr/events/instruments';
import type { StockDetailsEvent } from '@/types/tr/events/stock-details';
import { computed } from 'vue';

export interface Instrument {
  instrument: InstrumentEvent;
  stockDetails: StockDetailsEvent;
  etfDetails: ETFDetailsEvent;
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

export const isStock = computed(() => (instrument: Partial<Instrument>): instrument is Stock => {
  return instrument.instrument?.typeId == 'stock';
});

export const isETF = computed(() => (instrument: Partial<Instrument>): instrument is ETF => {
  return instrument.instrument?.typeId == 'fund';
});
