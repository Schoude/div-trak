<script setup lang="ts">
defineProps<{
  isInDetailPortfolio: boolean;
}>();
</script>

<template>
  <div class="instrument-portfolio-info">
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