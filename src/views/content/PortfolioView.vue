<script setup lang="ts">
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { computed, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();

const detailPortfolio = authStore.user?.portfolios.find(p => p.id.toString() === router.currentRoute.value.params.id);

if (!detailPortfolio) {
  router.push({ name: 'dashboard' });
}

const instruments = computed(() => instrumentStore.getInstrumentsFilled(detailPortfolio!).sort((a, b) => b.value - a.value));

function getInstrumentsData () {
  detailPortfolio?.isins.forEach(isin => {
    const existingInsrument = instrumentStore.getInstrument(isin);
    if (existingInsrument) {
      // Re-sub for existing ticker of the instrument
      socket.sendMessage(`sub ${existingInsrument.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

      return;
    }

    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"stockDetails","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
  });
}

onMounted(() => {
  getInstrumentsData();
});

onBeforeRouteLeave(() => {
  instruments.value.forEach(instrumentData => {
    if (!instrumentData) {
      return;
    }

    socket.sendMessage(`unsub ${instrumentData.tickerEventId}`, { updateEventId: false });
  });
});
</script>

<template>
  <main class="portfolio-view view">
    <h1>{{ detailPortfolio?.name }}</h1>
    <div class="instruments" v-if="instruments && instruments?.length > 0">
      <!-- TODO: move into component InstrumentFilled -->
      <div class="instrument" v-for="instrument of instruments" :key="instrument?.instrument?.shortName">
        <TRAssetLoader asset-type="image" :image-id="instrument?.instrument.imageId!" />
        <div class="name">{{
          instrument?.instrument?.shortName }}</div>
        <div class="amount">Anzahl: {{ instrument?.amount }}</div>
        <div class="value">Wert: {{ instrument?.value }}</div>
        <div class="price" :class="instrument?.sentimentIntraDay">Preis: {{ instrument?.priceBid }}</div>
        <hr>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
</style>
