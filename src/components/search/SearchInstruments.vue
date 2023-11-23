<script setup lang='ts'>
import InputSearch from '@/components/search/InputSearch.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

const searchInstruments = ref<HTMLElement | null>(null);
const resultsVisible = ref(false);

onClickOutside(searchInstruments, () => resultsVisible.value = false);

function onFocusInput () {
  if (resultsVisible.value) {
    return;
  }

  resultsVisible.value = true;
}
</script>

<template>
<div ref="searchInstruments" class="search-instruments">
  <InputSearch @focus:input="onFocusInput" />
  <SearchResults v-if="resultsVisible" />
</div>
</template>

<style lang='scss' scoped>
.search-instruments {
  position: relative;
}
</style>
