<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';

const socket = useTRSocket();
const router = useRouter();
const isin = router.currentRoute.value.params.isin as string;

function getInstrumentData (isin: string) {
  socket.sendMessage(`sub 10 {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
  socket.sendMessage(`sub 11 {"type":"stockDetails","id":"${isin}","jurisdiction":"DE"}`);
  socket.sendMessage(`sub 12 {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
}

onBeforeRouteUpdate((guard) => {
  getInstrumentData(guard.params.isin as string);
});

onMounted(() => {
  getInstrumentData(isin);
});
</script>

<template>
  <main class="instrument-view view">
    <h1>Instrument: {{ router.currentRoute.value.params.isin }}</h1>
  </main>
</template>

<style lang='scss' scoped>
</style>
