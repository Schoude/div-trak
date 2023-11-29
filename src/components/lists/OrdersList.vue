<script setup lang="ts">
import type { Order } from '@/supabase/types/helpers';
import OrderListItem from './OrderListItem.vue';

defineProps<{
  orders: Order[];
  portfolioName: string;
}>();
</script>

<template>
  <div class="orders-list">
    <h2 class="text-m">Orders in Portfolio <small>({{ portfolioName }})</small></h2>
    <ul>
      <OrderListItem v-for="(order, index) of orders" :key="index" :order="order" />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.orders-list {
  margin-block: 1.35rem;
}

h2 {
  margin-block-end: 0.35rem;
}

ul {
  padding: 0;
  padding-block-end: .85rem;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}
</style>