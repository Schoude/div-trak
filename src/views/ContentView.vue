<script setup lang='ts'>
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
</script>

<template>
<header>
  <nav>
    <RouterLink to="/dashboard">
      <LogoDivTrak />
    </RouterLink>
  </nav>
</header>

<div class="content-view">
  <RouterView />
</div>

<!-- BottomBar -->
</template>

<style lang='scss' scoped>
</style>
