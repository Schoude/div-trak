<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { useTickerStore } from '@/stores/ticker';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';

const socket = useTRSocket();
const instruments = useInstrumentsStore();
const ticker = useTickerStore();
const router = useRouter();
const isin = ref('');

const instrumentData = computed(() => instruments.getInstrument(isin.value));
const isFund = computed(() => instrumentData.value?.instrument?.typeId === 'fund');
const tickerData = computed(() => ticker.getTicker(instrumentData.value?.tickerEventId!));

watchEffect(() => {
  isin.value = router.currentRoute.value.params.isin as string;
});

onMounted(() => {
  getInstrumentData(isin.value);
});

onBeforeRouteUpdate((guard) => {
  getInstrumentData(guard.params.isin as string);
});

function getInstrumentData (isin: string) {
  if (instruments.getInstrument(isin)) {
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
      <h1 class="text-l">{{ instrumentData?.instrument?.shortName }}</h1>
      <p>{{ isFund }}</p>
      <p>{{ tickerData }}</p>
    </template>
  </main>
</template>

<style lang='scss' scoped>
</style>
