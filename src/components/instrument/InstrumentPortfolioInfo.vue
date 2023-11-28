<script setup lang="ts">
import type { DividendWithPayment } from '@/types/tr/events/stock-details';

defineProps<{
  dividendsWithPayment: DividendWithPayment[];
  isInDetailPortfolio: boolean;
}>();
</script>

<template>
  <div class="instrument-portfolio-info">
    <p v-if="isInDetailPortfolio" class="text-xs">{{ dividendsWithPayment }}</p>
  </div>
</template>