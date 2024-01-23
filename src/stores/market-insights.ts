import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useTickerStore } from './ticker';

export interface InstrumentMover {
  tickerId: number;
  imageId: string;
  isin: string;
  name: string;
}

export const useMarketInsights = defineStore('market-insights', () => {
  const tickerStore = useTickerStore();

  const dailyBest = ref<InstrumentMover[]>([]);
  const dailyWorst = ref<InstrumentMover[]>([]);

  const dailyBestComplete = computed(() => {
    return dailyBest.value?.map(instrument => {
      const ticker = tickerStore.getTicker(instrument.tickerId);
      const changePercent = (+ticker?.ask.price! / +ticker?.pre.price! - 1) * 100;

      return {
        ...instrument,
        sentiment: 'sentiment-bullish',
        changePercentRaw: changePercent,
        changePercent: `${Math.abs(changePercent).toFixed(2)} %`,
      };
    }).sort((a, b) => b.changePercentRaw - a.changePercentRaw);
  });

  const dailyWorstComplete = computed(() => {
    return dailyWorst.value?.map(instrument => {
      const ticker = tickerStore.getTicker(instrument.tickerId);
      const changePercent = (+ticker?.ask.price! / +ticker?.pre.price! - 1) * 100;

      return {
        ...instrument,
        sentiment: 'sentiment-bearish',
        changePercentRaw: changePercent,
        changePercent: `${Math.abs(changePercent).toFixed(2)} %`,
      };
    }).sort((a, b) => a.changePercentRaw - b.changePercentRaw);
  });

  return {
    dailyBest,
    dailyBestComplete,
    dailyWorst,
    dailyWorstComplete,
  };
});
