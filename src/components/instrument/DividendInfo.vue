<script setup lang='ts'>
import type { Dividend, DividendWithPayment } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';

withDefaults(defineProps<{
  dividend: Dividend | DividendWithPayment;
  currency?: 'EUR' | 'USD';
}>(), {
  currency: 'EUR',
});
</script>

<template>
  <div class="dividend-info text-xs">
    <div class="grid">
      <div class="text-s"><b>{{ formatNumber(dividend.amount, {
        style: 'currency', currency: currency, roundingMode: 'ceil'
      }) }}</b></div>
      <div v-if="dividend.type">Type: {{ dividend.type }}</div>
    </div>
    <div class="text-s">Ex Date: {{ new Date(dividend.exDate).toLocaleDateString() }}</div>
    <div>Record Date: {{ dividend.recordDate ? new Date(dividend.recordDate).toLocaleDateString() : 'n. a.' }}</div>
    <div class="text-s"><b>Payment Date: {{ new Date(dividend.paymentDate).toLocaleDateString() }}</b></div>
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
