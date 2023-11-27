<script setup lang='ts'>
import FundDetail from '@/components/detail-views/FundDetail.vue';
import StockDetail from '@/components/detail-views/StockDetail.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { useTickerStore } from '@/stores/ticker';
import { isETF, isStock } from '@/types/tr/instrument';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router';

const socket = useTRSocket();
const instruments = useInstrumentsStore();
const ticker = useTickerStore();
const router = useRouter();
const isin = ref('');

const instrumentData = computed(() => instruments.getInstrument(isin.value));
const tickerData = computed(() => ticker.getTicker(instrumentData.value?.tickerEventId!));

watchEffect(() => {
  isin.value = router.currentRoute.value.params.isin as string;
});

onMounted(() => {
  getInstrumentData(isin.value);
});

onBeforeRouteLeave(() => {
  socket.sendMessage(`unsub ${instrumentData.value?.tickerEventId}`, { updateEventId: false });
});

onBeforeRouteUpdate((guard) => {
  getInstrumentData(guard.params.isin as string);
});

function getInstrumentData (isin: string) {
  if (instruments.getInstrument(isin)) {
    // Re-sub for existing ticker of the instrument
    socket.sendMessage(`sub ${instrumentData.value?.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

    return;
  }

  socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
  socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"stockDetails","id":"${isin}","jurisdiction":"DE"}`);
  socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
}
</script>

<template>
  <main class="instrument-view view">
    <template v-if="!instrumentData">
      <p>Lade Daten...</p>
    </template>

    <template v-else>
      <template v-if="isStock(instrumentData) && tickerData">
        <StockDetail :stock="instrumentData" :ticker="tickerData" />
      </template>
      <template v-if="isETF(instrumentData) && tickerData">
        <FundDetail :etf="instrumentData" :ticker="tickerData" />
      </template>
    </template>
  </main>
</template>

<style lang='scss' scoped></style>
