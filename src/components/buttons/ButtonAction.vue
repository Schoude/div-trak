<script setup lang='ts'>
defineProps<{
  variant: 'dawn' | 'dusk'
}>();
</script>

<template>
<button class="button-action" :class="[variant]">
  <slot />
</button>
</template>

<style lang='scss' scoped>
@use '@/styles/mixins';

.button-action {
  block-size: 48px;
  text-transform: uppercase;
  text-align: center;
  inline-size: 100%;
  letter-spacing: 1px;
  font-weight: 700;
  border-radius: 100px;
  box-shadow: var(--shadow);
  line-height: 1;
  background-repeat: no-repeat;
  @include mixins.outline;

  &.dawn {
    background-image: var(--gradient-dawn);
  }
  &.dusk {
    background-image: var(--gradient-dusk);
  }
}
</style>
