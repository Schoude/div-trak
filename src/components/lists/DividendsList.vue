<script setup lang='ts'>
import type { Dividend } from '@/types/tr/events/stock-details';
import TagText from '../display/TagText.vue';
import DividendListItem from './DividendListItem.vue';

defineProps<{
  dividends: Dividend[];
  frequency: string;
  yield: string;
}>();
</script>

<template>
  <div class="dividends-list">
    <h2 class="text-m">
      <slot name="title" />
    </h2>
    <TagText class="frequency">
      {{ frequency }} • {{ yield }}
    </TagText>
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

.frequency {
  display: inline-block;
}

ul {
  padding: 0;
  padding-block-end: .85rem;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}
</style>
