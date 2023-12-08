import type { AggregateHistory } from '@/components/instrument/aggregateHistory';
import { useTRSocket } from '@/composables/useTRSocket';
import { defineStore } from 'pinia';
import { readonly, ref, watch } from 'vue';

export const useAggretatesStore = defineStore('aggretates', () => {
  const isin = ref<string | null>();
  const aggregateHistoryId = ref(100);
  const aggregateHistory = ref<AggregateHistory | null>(null);
  const socket = useTRSocket();

  watch(isin, () => {
    const query = `sub ${aggregateHistoryId.value} {"type":"aggregateHistoryLight","range":"1d","id":"${isin.value}.LSX"}`;
    socket.sendMessage(query, { updateEventId: false });
    aggregateHistoryId.value = aggregateHistoryId.value +1;
  });

  return {
    aggregateHistoryId: readonly(aggregateHistoryId),
    aggregateHistory: readonly(aggregateHistory),
    isin,
  };
});
