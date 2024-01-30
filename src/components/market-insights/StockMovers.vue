<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';
import { useMarketInsights } from '@/stores/market-insights';
import MoverInstrument from './MoverInstrument.vue';

const socket = useTRSocket();
const marketInsights = useMarketInsights();

// Daily best
socket.sendMessage('sub 1000 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":15,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyBest"}]}}');
// Daily worst
socket.sendMessage('sub 1010 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":15,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyWorst"}]}}');
</script>

<template>
  <div class="stock-movers">
    <section class="movers">
      <h2>Daily Best</h2>
      <div class="instruments">
        <MoverInstrument v-for="instrument of marketInsights.dailyBestComplete" :key="instrument.isin"
          :instrument="instrument" />
      </div>
    </section>

    <section class="movers">
      <h2>Daily Worst</h2>
      <div class="instruments">
        <MoverInstrument v-for="instrument of marketInsights.dailyWorstComplete" :key="instrument.isin"
          :instrument="instrument" />
      </div>
    </section>
  </div>
</template>

<style lang='scss' scoped>
h2 {
  margin-block-start: 1.5rem;
  margin-block-end: .5rem;
}

.instruments {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.mover-instrument {
  inline-size: 15ch;
}
</style>
