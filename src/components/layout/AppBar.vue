<script setup lang='ts'>
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
</script>

<template>
<header class="app-bar">
  <nav>
    <RouterLink to="/dashboard">
      <LogoDivTrak />
    </RouterLink>
  </nav>
</header>
</template>

<style lang='scss' scoped>
.app-bar {
  display: flex;
  align-items: center;
  padding-inline: .5rem;
}
</style>
