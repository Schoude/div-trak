import { formatNumber } from '@/utils/intl/currency';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useTickerStore } from './ticker';

export interface InstrumentMover {
  tickerId: number;
  imageId: string;
  isin: string;
  name: string;
}

export interface InstrumentMoverComplete extends InstrumentMover {
  sentiment: 'sentiment-bearish' | 'sentiment-bullish';
  changePercentRaw: number;
  changePercent: string;
}

export const useMarketInsights = defineStore('market-insights', () => {
  const tickerStore = useTickerStore();

  const dailyBest = ref<InstrumentMover[]>([]);
  const dailyWorst = ref<InstrumentMover[]>([]);

  const dailyBestComplete = computed(() => {
    return dailyBest.value?.map(instrument => {
      const ticker = tickerStore.getTicker(instrument.tickerId);

      const changePercent = (+ticker?.ask.price! / +ticker?.pre.price! - 1) * 100;
      const changeFormatted = formatNumber(Math.abs(changePercent), { style: 'decimal', roundingMode: 'floor' });

      return {
        ...instrument,
        sentiment: 'sentiment-bullish',
        changePercentRaw: changePercent,
        changePercent: `${changeFormatted} %`,
      };
    }).sort((a, b) => b.changePercentRaw - a.changePercentRaw) as InstrumentMoverComplete[];
  });

  const dailyWorstComplete = computed(() => {
    return dailyWorst.value?.map(instrument => {
      const ticker = tickerStore.getTicker(instrument.tickerId);

      const changePercent = (+ticker?.ask.price! / +ticker?.pre.price! - 1) * 100;
      const changeFormatted = formatNumber(Math.abs(changePercent), { style: 'decimal', roundingMode: 'floor' });

      return {
        ...instrument,
        sentiment: 'sentiment-bearish',
        changePercentRaw: changePercent,
        changePercent: `${changeFormatted} %`,
      };
    }).sort((a, b) => a.changePercentRaw - b.changePercentRaw) as InstrumentMoverComplete[];
  });

  return {
    dailyBest,
    dailyBestComplete,
    dailyWorst,
    dailyWorstComplete,
  };
});
