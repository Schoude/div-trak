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
.content-view {
  overflow-y: auto;

  @media only screen and (width >=1440px) {
    inline-size: 1280px;
    margin-inline: auto;
  }
}
</style>
