<script setup lang='ts'>
import type { InstrumentMoverComplete } from '@/stores/market-insights';
defineProps<{
  instrument: InstrumentMoverComplete;
}>();
</script>

<template>
  <RouterLink :to="`/instrument/${instrument.isin}`" class="mover-instrument">
    <div class="name">{{ instrument.name }}</div>
    <div class="change text-s" :class="instrument.sentiment">{{ instrument.changePercent }}</div>
  </RouterLink>
</template>

<style lang='scss' scoped>
@use '../../styles/mixins';

.mover-instrument {
  padding: 0.75rem;
  border-radius: 8px;
  @include mixins.bg-list-item;
}
</style>
