<script setup lang="ts">
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { ETF } from '@/types/tr/instrument';

defineProps<{
  etf: ETF;
  ticker: TickerEvent;
}>();
</script>

<template>
  <section class="fund-detail">
    <h1 class="text-l">{{ etf.instrument.shortName }}</h1>
    <p>{{ ticker }}</p>
  </section>
</template>
