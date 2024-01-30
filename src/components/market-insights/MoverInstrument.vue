<script setup lang='ts'>
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { InstrumentMoverComplete } from '@/stores/market-insights';
defineProps<{
  instrument: InstrumentMoverComplete;
}>();
</script>

<template>
  <RouterLink :to="`/instrument/${instrument.isin}`" class="mover-instrument">
    <TRAssetLoader asset-type="image" :image-id="instrument.imageId!" />
    <div class="meta">
      <div class="name">{{ instrument.name }}</div>
      <div class="change text-s" :class="instrument.sentiment">{{ instrument.changePercent }}</div>
    </div>
  </RouterLink>
</template>

<style lang='scss' scoped>
@use '../../styles/mixins';

.mover-instrument {
  padding: 0.75rem;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-rows: 1fr auto;
  @include mixins.bg-list-item;
}
</style>
