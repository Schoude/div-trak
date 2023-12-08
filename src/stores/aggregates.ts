import { useTRSocket } from '@/composables/useTRSocket';
import type { AggregateHistoryEvent } from '@/types/tr/events/aggregate-history';
import { defineStore } from 'pinia';
import { readonly, ref, watch } from 'vue';

export const useAggretatesStore = defineStore('aggretates', () => {
  const isin = ref<string | null>();
  const aggregateHistoryId = ref(100);
  const range = ref('1d');
  const aggregateHistory = ref<AggregateHistoryEvent | null>(null);
  const socket = useTRSocket();

  watch(isin, () => {
    const query = `sub ${aggregateHistoryId.value} {"type":"aggregateHistoryLight","range":"${range.value}","id":"${isin.value}.LSX"}`;
    socket.sendMessage(query, { updateEventId: false });
    aggregateHistoryId.value = aggregateHistoryId.value +1;
  });

  return {
    aggregateHistoryId: readonly(aggregateHistoryId),
    aggregateHistory,
    range: readonly(range),
    isin,
    setAggregateHistory (newAggregateHistory: AggregateHistoryEvent | null) {
      aggregateHistory.value = newAggregateHistory;
    },
  };
});
