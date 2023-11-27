<script setup lang='ts'>
import type { Dividend } from '@/types/tr/events/stock-details';
import DividendListItem from './DividendListItem.vue';

defineProps<{
  dividends: Dividend[];
}>();
</script>

<template>
<div class="dividends-list">
  <h2 class="text-m">Dividends</h2>
  <ul>
    <DividendListItem v-for="dividend of dividends" :key="dividend.id" :dividend="dividend" />
  </ul>
</div>
</template>

<style lang='scss' scoped>
h2 {
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
