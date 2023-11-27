<script setup lang='ts'>
import type { Dividend } from '@/types/tr/events/stock-details';
import DividendListItem from './DividendListItem.vue';

defineProps<{
  dividends: Dividend[];
  frequency: string;
}>();
</script>

<template>
  <div class="dividends-list">
    <h2 class="text-m">Dividends</h2>
    <div class="frequency text-s">{{ frequency }}</div>
    <ul>
      <DividendListItem v-for="dividend of dividends" :key="dividend.id" :dividend="dividend" />
    </ul>
  </div>
</template>

<style lang='scss' scoped>
.dividends-list {
  margin-block: 1.35rem;
}

h2,
.frequency {
  margin-block-end: 0.35rem;
}

ul {
  padding: 0;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}
</style>
