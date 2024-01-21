import { useTickerStore } from '@/stores/ticker';
import type { Portfolio } from '@/supabase/types/helpers';
import type {
  Instrument,
  InstrumentFilled,
  Sentiment,
} from '@/types/tr/instrument';
import { formatNumber } from '@/utils/intl/currency';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useInstrumentsStore = defineStore('instruments', () => {
  const instruments = ref(new Map<string, Partial<Instrument>>());
  const ticker = useTickerStore();

  function setInstrument (isin: string, instrument: Partial<Instrument>) {
    instruments.value.set(isin, instrument);
  }

  const getInstrument = computed(() => (isin: string) => {
    return instruments.value.get(isin);
  });

  function fillInstrument (isin: string, portfolio: Portfolio) {
    const instrument = getInstrument.value(isin);
    if (!instrument) {
      return;
    }
    const instrumentTicker = ticker.getTicker(instrument!.tickerEventId!);

    if (!instrumentTicker) {
      return;
    }

    const ordersForInstrument = portfolio.orders.filter((order) =>
      order.isin === isin,
    );
    const currentAmount = ordersForInstrument.reduce((acc, value) => {
      acc += value.amount;

      return acc;
    }, 0);

    const priceOpen = +instrumentTicker!.pre.price;
    const priceBid = +instrumentTicker!.bid.price;
    const value = currentAmount * priceBid;

    const sentimentIntraDay: Sentiment = priceBid >= priceOpen
      ? 'sentiment-bullish'
      : 'sentiment-bearish';

    return {
      ...instrument,
      amount: currentAmount,
      value,
      valueFormatted: formatNumber(value, { style: 'currency', currency: 'EUR' }),
      priceBid: formatNumber(+priceBid, { style: 'currency', currency: 'EUR' }),
      sentimentIntraDay,
    } as InstrumentFilled;
  }

  return {
    instruments,
    getInstrument,
    getInstrumentWithTicker (isin: string) {
      const ticker = useTickerStore();

      const instrument = getInstrument.value(isin);

      if (!instrument) {
        return;
      }

      const instrumentTicker = ticker.getTicker(instrument!.tickerEventId!);

      // if (!instrumentTicker) {
      //   return;
      // }

      // console.log(instrument.instrument?.isin);
      console.log(instrumentTicker);

      return {
        ...instrument,
        ticker: instrumentTicker,
      };
    },
    upsertInstrument (isin: string, updateData: Partial<Instrument>) {
      const toUpdate = getInstrument.value(isin);

      if (!toUpdate) {
        setInstrument(isin, { ...updateData });

        return;
      }

      const updated = Object.assign(toUpdate, { ...updateData });
      setInstrument(isin, updated);
    },
    getInstruments: computed(() => [...instruments.value.values()]),
    getInstrumentsFilled: computed(() => {
      return (portFolio: Portfolio) => {
        return portFolio?.isins
          .map<InstrumentFilled | undefined>((isin) =>
            fillInstrument(isin, portFolio),
          )
          .filter((instrument) => instrument != null) as InstrumentFilled[];
      };
    }),
  };
});
