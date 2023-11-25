import { useTickerStore } from '@/stores/ticker';
import type { Portfolio } from '@/supabase/types/helpers';
import type {
  Instrument,
  InstrumentFilled,
  Sentiment,
} from '@/types/tr/instrument';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useInstrumentsStore = defineStore('instruments', () => {
  const instruments = ref(new Map<string, Partial<Instrument>>());
  const ticker = useTickerStore();

  function setInstrument (isin: string, instrument: Partial<Instrument>) {
    instruments.value.set(isin, instrument);
  }

  function getInstrument (isin: string) {
    return instruments.value.get(isin);
  }

  function fillInstrument (isin: string, portFolio: Portfolio) {
    const instrument = getInstrument(isin);
    if (!instrument) {
      return;
    }
    const instrumentTicker = ticker.getTicker(instrument!.tickerEventId!);

    if (!instrumentTicker) {
      return;
    }

    const ordersForInstrument = portFolio.orders.filter((order) =>
      order.isin === isin
    );
    const currentAmount = ordersForInstrument.reduce((acc, value) => {
      acc += value.amount;

      return acc;
    }, 0);

    const priceOpen = +instrumentTicker!.open.price;
    const priceBid = +instrumentTicker!.bid.price;
    const value = +(currentAmount * priceBid).toFixed(2);

    const sentimentIntraDay: Sentiment = priceBid >= priceOpen
      ? 'sentiment-bullish'
      : 'sentiment-bearish';

    return {
      ...instrument,
      amount: currentAmount,
      value,
      priceBid,
      sentimentIntraDay,
    } as InstrumentFilled;
  }

  return {
    instruments,
    getInstrument,
    upsertInstrument (isin: string, updateData: Partial<Instrument>) {
      const toUpdate = this.getInstrument(isin);

      if (!toUpdate) {
        setInstrument(isin, { ...updateData });

        return;
      }

      const updated = Object.assign(toUpdate, { ...updateData });
      setInstrument(isin, updated);
    },
    getInstrumentsFilled: computed(() => {
      return (portFolio: Portfolio) => {
        return portFolio.isins
          .map<InstrumentFilled | undefined>((isin) =>
            fillInstrument(isin, portFolio)
          )
          .filter((instrument) => instrument != null) as InstrumentFilled[];
      };
    }),
  };
});
