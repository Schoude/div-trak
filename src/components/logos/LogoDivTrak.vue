<script setup lang='ts'>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  width?: number
}>(), {
  width: 50,
});

const dropShadowStyle = computed(() => {
  return props.width > 100 ? 'filter: drop-shadow(-4px 4px 8px black)' : '';
});

</script>

<template>
  <img class="logo-div-trak" :style="dropShadowStyle" :width="width" src="/logo-div-trak.png" alt="Div Trak Logo">
</template>

<style scoped>
</style>
