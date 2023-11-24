import type { InstrumentEvent } from './events/instruments';
import type { StockDetailsEvent } from './events/stock-details';
import type { TickerEvent } from './events/ticker';

export interface Instrument {
  instrument: InstrumentEvent;
  stockDetails: StockDetailsEvent;
  ticker: TickerEvent;
}
