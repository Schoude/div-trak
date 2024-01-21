<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';

const socket = useTRSocket();

// Daily best
socket.sendMessage('sub 900 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":10,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyBest"}]}}');
// Daily worst
socket.sendMessage('sub 910 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":10,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"},{"key":"relativePerformance","value":"dailyWorst"}]}}');
</script>

<template>
<div class="stock-movers">
  <h2>Stock Movers</h2>
</div>
</template>

<style lang='scss' scoped>
</style>
