import type { ETFDetailsEvent } from '@/types/tr/events/etf-details';
import type { InstrumentEvent } from '@/types/tr/events/instruments';
import type { NeonSearchEvent } from '@/types/tr/events/neon-search';
import type { StockDetailsEvent } from '@/types/tr/events/stock-details';
import type { TickerEvent } from '@/types/tr/events/ticker';

export type EventType = NeonSearchEvent | InstrumentEvent | StockDetailsEvent | ETFDetailsEvent | TickerEvent;

export interface EventReturnvalue<T = EventType> {
  eventId: number;
  jsonObject: T;
}

export function isNeonSearchEvent (event: {eventId: number; jsonObject: EventType;}): event is EventReturnvalue<NeonSearchEvent>  {
  return (event.jsonObject as NeonSearchEvent).results != null;
}

export function isInstrumentEvent (event: {eventId: number; jsonObject: EventType;}): event is EventReturnvalue<InstrumentEvent>  {
  return (event.jsonObject as InstrumentEvent).typeId != null;
}

export function isStockDetailsEvent (event: {eventId: number; jsonObject: EventType;}): event is EventReturnvalue<StockDetailsEvent>  {
  const stockDetailsEvent = (event.jsonObject as StockDetailsEvent);

  return stockDetailsEvent.analystRating != null && stockDetailsEvent.isin !== '';
}

export function isETFDetailsEvent (event: {eventId: number; jsonObject: EventType;}): event is EventReturnvalue<ETFDetailsEvent>  {
  const etfDetailsEvent = (event.jsonObject as ETFDetailsEvent);

  return etfDetailsEvent.replicationMethod != null && etfDetailsEvent.isin !== '';
}

export function isTickerEvent (event: {eventId: number; jsonObject: EventType;}): event is EventReturnvalue<TickerEvent>  {
  return (event.jsonObject as TickerEvent).qualityId != null;
}
