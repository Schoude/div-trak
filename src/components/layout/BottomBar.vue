<script setup lang='ts'>
import SearchFieldInstruments from '../inputs/SearchFieldInstruments.vue';
</script>

<template>
  <footer class="bottom-bar">
    <SearchFieldInstruments />
  </footer>
</template>

<style lang='scss' scoped>
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: .5rem;
}

.search-field-instruments {
  flex: 1;
}
</style>
