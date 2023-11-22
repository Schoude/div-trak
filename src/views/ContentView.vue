<script setup lang='ts'>
import AppBar from '@/components/layout/AppBar.vue';
import BottomBar from '@/components/layout/BottomBar.vue';
</script>

<template>
  <AppBar />

  <div class="content-view">
    <RouterView />
  </div>

  <BottomBar />
</template>

<style lang='scss' scoped>
</style>
