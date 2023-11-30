<script setup lang='ts'>
import type { Dividend, DividendWithPayment } from '@/types/tr/events/stock-details';
import { computed } from 'vue';
import DividendInfo from '../instrument/DividendInfo.vue';

const props = defineProps<{
  dividend: Dividend | DividendWithPayment;
}>();

const isPastDividend = computed(() => {
  const now = Date.now();
  const paymentDate = new Date(props.dividend.paymentDate).getTime();

  return now >= paymentDate ? 'past' : '';
});
</script>

<template>
  <li class="dividend-list-item" :class="isPastDividend">
    <div class="inner">
      <template v-if="'paymentAmount' in dividend">
        <div><b>{{ dividend.paymentAmount }}</b> • <small>({{ dividend.amountAtExDate }} pcs.)</small></div>
        <template v-if="dividend.sourceTax">
          <pre class="text-xs">Source Tax: {{ dividend.sourceTax }}</pre>
        </template>
      </template>

      <DividendInfo v-if="dividend" :dividend="dividend" />
    </div>
  </li>
</template>

<style lang='scss' scoped>
.dividend-list-item {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  box-shadow: var(--shadow);

  &.past {
    border: 1px solid var(--color-bullish);
  }
}

.inner {
  inline-size: 220px;
}
</style>
