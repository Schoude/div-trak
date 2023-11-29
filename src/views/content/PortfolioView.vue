<script setup lang="ts">
import InstrumentListItem from '@/components/lists/InstrumentListItem.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

portfolioStore.selectPortfolio(+router.currentRoute.value.params.id);

if (!portfolioStore.detailPortfolio) {
  router.push({ name: 'dashboard' });
}

function getInstrumentsData () {
  portfolioStore.detailPortfolio?.isins.forEach(isin => {
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
  portfolioStore.instruments.forEach(instrumentData => {
    if (!instrumentData) {
      return;
    }

    socket.sendMessage(`unsub ${instrumentData.tickerEventId}`, { updateEventId: false });
  });
});
</script>

<template>
  <main class="portfolio-view view">
    <h1>{{ portfolioStore.detailPortfolio?.name }}</h1>
    <h2>Instruments</h2>
    <ul class="instruments-list" v-if="portfolioStore.instruments && portfolioStore.instruments?.length > 0">
      <InstrumentListItem :instrument="instrument" v-for="instrument of portfolioStore.instruments"
        :key="instrument?.instrument?.shortName" />
    </ul>
  </main>
</template>

<style scoped lang="scss">
.instruments-list {
  padding: 0;
  padding-block-start: 1rem;
  display: grid;
  gap: 1rem;

  @media only screen and (width >=1280px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
