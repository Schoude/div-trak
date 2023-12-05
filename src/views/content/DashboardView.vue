<script setup lang="ts">
import ListPortfolios from '@/components/display/ListPortfolios.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
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
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
  });
});
</script>

<template>
  <main class="dashboard-view view">
    <ListPortfolios />
  </main>
</template>

<style scoped lang="scss">
</style>
