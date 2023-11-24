<script setup lang='ts'>
import InputSearch from '@/components/search/InputSearch.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { onClickOutside } from '@vueuse/core';
import { ref, watch } from 'vue';

const socket = useTRSocket();

const searchInstruments = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const resultsVisible = ref(false);

onClickOutside(searchInstruments, () => resultsVisible.value = false);

watch(searchQuery, (query) => {
  socket.sendMessage(`sub 1 {"type":"neonSearch","data":{"q":"${query}","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}`);
  socket.sendMessage(`sub 2 {"type":"neonSearch","data":{"q":"${query}","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}`);
});

function onHideNavigation () {
  resultsVisible.value = false;
  searchQuery.value = '';
}

function onFocusInput () {
  if (searchQuery.value === '') {
    socket.sendMessage('sub 1 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}');
    socket.sendMessage('sub 2 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}');
  }

  resultsVisible.value = true;
}
</script>

<template>
  <div ref="searchInstruments" class="search-instruments">
    <InputSearch @focus:input="onFocusInput" v-model="searchQuery" />
    <SearchResults v-if="resultsVisible" @hide="resultsVisible = false" @hide:navigation="onHideNavigation" />
  </div>
</template>

<style lang='scss' scoped>
.search-instruments {
  position: relative;
}
</style>
