<script setup lang="ts">
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { Stock } from '@/types/tr/instrument';

defineProps<{
  stock: Stock;
  ticker: TickerEvent;
}>();
</script>

<template>
  <section class="stock-detail">
    <h1 class="text-l">{{ stock.instrument.shortName }}</h1>
    <p>{{ ticker }}</p>
  </section>
</template>
