<script setup lang="ts">
import type { Order } from '@/supabase/types/helpers';

defineProps<{
  order: Order;
}>();
</script>

<template>
  <li class="order-list-item" :class="order.execution_type">
    <div class="inner">
      <div class="amount"><b>{{ order.amount }} pcs.</b></div>
      <div class="executed-at text-s">@ {{ new Date(order.executed_at).toLocaleDateString() }}</div>
      <div class="text-xs">{{ order.execution_type }}</div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.order-list-item {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  box-shadow: var(--shadow);

  &.normal {
    border-color: var(--color-bullish);
  }

  &.forecast {
    border-color: var(--color-accent-1);
  }
}

.inner {
  inline-size: 220px;
}
</style>