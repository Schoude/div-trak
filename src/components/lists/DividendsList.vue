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

    <div class="wrapper">
      <TagText class="frequency">
        {{ frequency }} • {{ yield }}
      </TagText>
      <slot name="action-dividendhistory" />
    </div>

    <ul>
      <DividendListItem v-for="dividend of dividends" :key="dividend.id" :dividend="dividend" />
    </ul>
  </div>
</template>

<style lang='scss' scoped>
.dividends-list {
  margin-block: 1.35rem;
}

h2 {
  margin-block-end: 0.35rem;
}

.frequency {
  block-size: max-content;
}

ul {
  padding: 0;
  padding-block-end: .85rem;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-block-end: 0.7rem;
}
</style>
