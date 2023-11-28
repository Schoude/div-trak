<script setup lang="ts">
import OrderManager from '@/components/order/OrderManager.vue';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { Instrument } from '@/types/tr/instrument';
import { computed } from 'vue';


const props = defineProps<{
  isInDetailPortfolio: boolean;
  instrument: Instrument;
}>();

const portfolioStore = usePortfolioStore();

const amountOwned = computed(() => portfolioStore.detailPortfolio
  ?.orders
  .filter(order => order.isin === props.instrument.instrument.isin)
  .reduce((acc, order) => {
    acc = acc + order.amount;

    return acc;
  }, 0) ?? 0);
</script>

<template>
  <div class="instrument-portfolio-info">
    <OrderManager :amount-owned="amountOwned" :instrument="instrument"
      :portfolio-name="portfolioStore.detailPortfolio?.name ?? ''" />

    <template v-if="isInDetailPortfolio">
      <slot name="dividends" />
    </template>

  </div>
</template>

<style lang="scss" scoped>
.instrument-portfolio-info {
  margin-block: 1.35rem;
}
</style>