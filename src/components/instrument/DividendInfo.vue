<script setup lang='ts'>
import type { Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';

defineProps<{
  dividend: Dividend;
}>();
</script>

<template>
  <div class="dividend-info text-xs">
    <div class="grid">
      <div><b>{{ formatNumber(dividend.amount, { style: 'currency', currency: 'EUR', roundingMode: 'ceil' }) }}</b></div>
      <div>Type: {{ dividend.type }}</div>
    </div>
    <div>Ex Date: {{ new Date(dividend.exDate).toLocaleDateString() }}</div>
    <div>Record Date: {{ new Date(dividend.recordDate).toLocaleDateString() }}</div>
    <div><b>Payment Date: {{ new Date(dividend.paymentDate).toLocaleDateString() }}</b></div>
  </div>
</template>

<style lang='scss' scoped>
.dividend-info {
  margin-block-start: .35rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
