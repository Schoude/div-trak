<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import ListPortfolios from '@/components/display/ListPortfolios.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const instrumentStore = useInstrumentsStore();
const socket = useTRSocket();

authStore.user?.portfolios.forEach(portfolio => {
  portfolio.isins.forEach(isin => {
    const existingInsrument = instrumentStore.getInstrument(isin);
    if (existingInsrument) {
      // Re-sub for existing ticker of the instrument
      socket.sendMessage(`sub ${existingInsrument.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

      return;
    }

    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
  });
});

onBeforeRouteLeave(() => {
  authStore.user?.portfolios.forEach(portfolio => {
    portfolio.isins.forEach(isin => {
      const existingInsrument = instrumentStore.getInstrument(isin);
      if (existingInsrument) {
        socket.sendMessage(`unsub ${existingInsrument.tickerEventId}`, { updateEventId: false });
      }
    });
  });
});

async function onNavigateToTRAuth () {
  router.push({ name: 'tr-auth' });
}

async function onNavigateToMarketInsights () {
  router.push({ name: 'market-insights' });
}
</script>

<template>
  <main class="dashboard-view view">
    <ListPortfolios />
    <nav class="nav-secondary">
      <ButtonAction variant="dusk" class="button-link button-link-tr-auth" @click="onNavigateToTRAuth">Login to TR</ButtonAction>
      <ButtonAction variant="dawn" class="button-link button-market-insights" @click="onNavigateToMarketInsights">Market Insights</ButtonAction>
    </nav>
  </main>
</template>

<style scoped lang="scss">
.nav-secondary {
  margin-block-start: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.button-link {
  inline-size: fit-content;
  padding-inline: 1rem 1rem;
  block-size: 2.25rem;
}
</style>
