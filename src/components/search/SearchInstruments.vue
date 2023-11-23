<script setup lang='ts'>
import InputSearch from '@/components/search/InputSearch.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import { ref } from 'vue';

const resultsVisible = ref(false);

function onFocusInput () {
  if (resultsVisible.value) {
    return;
  }

  resultsVisible.value = true;
}
</script>

<template>
<div class="search-instruments">
  <InputSearch @focus:input="onFocusInput" />
  <SearchResults v-if="resultsVisible" />
</div>
</template>

<style lang='scss' scoped>
.search-instruments {
  position: relative;
}
</style>
