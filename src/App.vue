<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
#app {
  &:has(.content-view) {
    display: grid;
    grid-template-rows: 4.5rem 1fr 4.5rem;
  }
}
</style>
