<script setup lang='ts'>
import EventListItem from '@/components/lists/EventListItem.vue';
import type { Event } from '@/types/tr/events/stock-details';

defineProps<{
  events: Event[];
}>();
</script>

<template>
  <div class="events-list">
    <h2 class="text-m">Upcoming Events</h2>
    <ul>
      <EventListItem v-for="event of events" :key="event.id" :event="event" />
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
  padding-block-end: .85rem;
}
</style>
