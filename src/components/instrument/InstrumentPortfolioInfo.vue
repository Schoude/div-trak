<script setup lang="ts">
import OrdersList from '@/components/lists/OrdersList.vue';
import OrderManager from '@/components/order/OrderManager.vue';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { ETF, Stock } from '@/types/tr/instrument';
import { computed } from 'vue';

const props = defineProps<{
  isInDetailPortfolio: boolean;
  instrument: Stock | ETF;
}>();

const portfolioStore = usePortfolioStore();

const amountOwned = computed(() => portfolioStore.detailPortfolio
  ?.orders
  .filter(order => order.isin === props.instrument.instrument.isin)
  .reduce((acc, order) => {
    acc = acc + order.amount;

    return acc;
  }, 0) ?? 0);

const ordersOfInstrument = computed(() => portfolioStore.detailPortfolio
  ?.orders
  .filter(order => order.isin === props.instrument.instrument.isin)
  .sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()));
</script>

<template>
  <div class="instrument-portfolio-info">
    <OrderManager v-if="portfolioStore.detailPortfolio" :amount-owned="amountOwned" :instrument="instrument"
      :portfolio="portfolioStore.detailPortfolio!" :is-in-detail-portfolio="isInDetailPortfolio" />

    <template v-if="isInDetailPortfolio">
      <slot name="dividends" />

      <OrdersList v-if="ordersOfInstrument" :orders="ordersOfInstrument" :portfolio="portfolioStore.detailPortfolio!" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.instrument-portfolio-info {
  margin-block: 1.35rem;
}
</style>
