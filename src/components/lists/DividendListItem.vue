<script setup lang='ts'>
import type { Dividend } from '@/types/tr/events/stock-details';
import DividendInfo from '../instrument/DividendInfo.vue';

defineProps<{
  dividend: Dividend;
}>();
</script>

<template>
<li class="dividend-list-item">
  <div class="inner">
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
}

.inner {
  inline-size: 220px;
  position: relative;
}
</style>
