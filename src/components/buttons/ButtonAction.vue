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
.button-action {
  block-size: 48px;
  text-transform: uppercase;
  text-align: center;
  inline-size: 100%;
  letter-spacing: 1px;
  font-weight: 700;
  outline: 1px solid transparent;
  outline-offset: 2px;
  border-radius: 100px;
  box-shadow: var(--shadow);
  line-height: 1;
  background-repeat: no-repeat;
  transition: outline 150ms ease-out;

  &:hover,
  &:focus-visible {
    outline: 1px solid rgba(255, 255, 255, 0.35);
  }

  &.dawn {
    background-image: var(--gradient-dawn);
  }
  &.dusk {
    background-image: var(--gradient-dusk);
  }
}
</style>
