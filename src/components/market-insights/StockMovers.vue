<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';
import { useMarketInsights } from '@/stores/market-insights';
import MoverInstrument from './MoverInstrument.vue';

const socket = useTRSocket();
const marketInsights = useMarketInsights();

// Daily best
socket.sendMessage('sub 1000 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":10,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyBest"}]}}');
// Daily worst
socket.sendMessage('sub 1010 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":10,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyWorst"}]}}');

</script>

<template>
  <div class="stock-movers">
    <h2>Stock Movers</h2>

    <section class="movers">
      <h3>Daily Best</h3>
      <div class="instruments">
        <MoverInstrument v-for="instrument of marketInsights.dailyBestComplete" :key="instrument.isin"
          :instrument="instrument" />
      </div>
    </section>

    <section class="movers">
      <h3>Daily Worst</h3>
      <div class="instruments">
        <MoverInstrument v-for="instrument of marketInsights.dailyWorstComplete" :key="instrument.isin"
          :instrument="instrument" />
      </div>
    </section>
  </div>
</template>

<style lang='scss' scoped>
.instruments {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
</style>
