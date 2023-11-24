<script setup lang='ts'>
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <main class="instrument-view view">
    <h1>Instrument: {{ router.currentRoute.value.params.isin }}</h1>
  </main>
</template>

<style lang='scss' scoped>
</style>
