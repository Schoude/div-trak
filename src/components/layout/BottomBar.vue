<script setup lang='ts'>
import SearchInstruments from '../inputs/SearchInstruments.vue';
</script>

<template>
  <footer class="bottom-bar">
    <SearchInstruments />
  </footer>
</template>

<style lang='scss' scoped>
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: .5rem;
}

.search-instruments {
  flex: 1;
}
</style>
