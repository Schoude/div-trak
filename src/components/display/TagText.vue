<script setup lang='ts'>
</script>

<template>
  <span class="tag-text text-xs">
    <slot />
  </span>
</template>

<style lang='scss' scoped>
.tag-text {
  color: var(--color-muted);
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: .25rem .45rem;
  line-height: 1;
  border-radius: 50px;
}
</style>
