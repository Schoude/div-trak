<script setup lang="ts">
import type { Order } from '@/supabase/types/helpers';
import IconDelete from '../icons/IconDelete.vue';

defineProps<{
  order: Order;
}>();

defineEmits<{
  (event: 'delete', order: Order): void
}>();
</script>

<template>
  <li class="order-list-item" :class="order.execution_type">
    <div class="inner">
      <div class="amount"><b>{{ order.amount }} pcs.</b></div>
      <div class="executed-at text-s">@ {{ new Date(order.executed_at).toLocaleDateString() }}</div>
      <div class="text-xs">{{ order.execution_type }}</div>
    </div>

    <button class="button-order-delete" type="button" title="Hide search results" @click="$emit('delete', order)">
      <IconDelete />
    </button>
  </li>
</template>

<style scoped lang="scss">
.order-list-item {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  position: relative;

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

.button-order-delete {
  position: absolute;
  inset-block-start: .48rem;
  inset-inline-end: .48rem;
  transition: scale 150ms ease-out;

  &:hover,
  &:focus-visible {
    scale: 1.08;

    .icon-delete {
      fill: var(--color-bearish);
    }
  }

  .icon-delete {
    transition: fill 250ms ease-out;
    fill: rgba(255, 255, 255, 0.3);
  }
}
</style>