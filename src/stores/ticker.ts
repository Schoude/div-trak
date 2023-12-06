import type { TickerEvent } from '@/types/tr/events/ticker';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTickerStore = defineStore('ticker', () => {
  const ticker = ref(new Map<number, TickerEvent>());

  return {
    ticker,
    setTicker (eventId: number, newTicker: TickerEvent) {
      ticker.value.set(eventId, newTicker);
    },
    getTicker: computed(() => (eventId: number) => {
      return ticker.value.get(eventId);
    })
  };
});
