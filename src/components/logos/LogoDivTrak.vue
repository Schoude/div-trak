<script setup lang='ts'>
withDefaults(defineProps<{width: number}>(), { width: 50 });
</script>

<template>
  <img :width="width" src="/logo-div-trak.png" alt="Div Trak Logo">
</template>
