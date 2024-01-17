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
</script>

<template>
  <main class="dashboard-view view">
    <ListPortfolios />
    <ButtonAction variant="dusk" class="button-link-tr-auth" @click="onNavigateToTRAuth">Login to TR</ButtonAction>
  </main>
</template>

<style scoped lang="scss">
.button-link-tr-auth {
  display: inline-block;
  margin-block-start: 2rem;
  inline-size: fit-content;
  padding-inline: 1rem 1rem;
  block-size: 2.25rem;
}
</style>
