<script setup lang='ts'>
import type { Event } from '@/types/tr/events/stock-details';
import DividendInfo from '../instrument/DividendInfo.vue';

defineProps<{
  event: Event;
}>();
</script>

<template>
  <li class="event-list-item">
    <div class="inner">
      <div class="title text-regular">{{ event.title }}</div>
      <div class="byline text-xs">{{ new Date(event.timestamp).toLocaleDateString() }}</div>
      <p class="text-xs">{{ event.description }}</p>

      <DividendInfo v-if="event.dividend" :dividend="event.dividend" />
    </div>
  </li>
</template>

<style lang='scss' scoped>
.event-list-item {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
}

.inner {
  inline-size: 220px;
  position: relative;
}

.title {
  margin-block-end: .35rem;
}

.byline {
  position: absolute;
  inset-inline-end: 0;
  inset-block-start: 0;
  color: var(--color-muted);
}
</style>
