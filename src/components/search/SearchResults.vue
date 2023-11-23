<script setup lang='ts'>
import { useNeonSearchStore } from '@/stores/neon-search';
import SearchResultListItem from './SearchResultListItem.vue';

const search = useNeonSearchStore();

</script>

<template>
  <section class="search-results">
    <article class="result results-stocks">
      <h2 class="title text-l">Stocks</h2>
      <ul class="results-list">
        <SearchResultListItem v-for="stock of search.searchResultsStocks" :result="stock" :key="stock.isin" />
      </ul>
    </article>

    <div class="line"></div>

    <article class="result results-etfs">
      <h2 class="title text-l">ETFs</h2>
      <ul class="results-list">
        <SearchResultListItem v-for="etf of search.searchResultsETFs" :result="etf" :key="etf.isin" />
      </ul>
    </article>
  </section>
</template>

<style lang='scss' scoped>
.search-results {
  position: absolute;
  inset-block-end: 140%;
  inline-size: 95vw;
  // TODO: desktop - should be a bit bitter than the input field > 420px

  // TODO: mobile - could be much higher on desktop
  min-block-size: 400px;
  max-block-size: 550px;
  border: 1px solid rgb(48, 48, 48);
  border-radius: 8px;
  box-shadow: var(--shadow);
  background-color: rgb(10, 10, 10);
  background-image: var(--gradient-page);
  background-repeat: no-repeat;
}

.title {
  padding-inline: 1rem;
  padding-block-start: 1rem;
}

.results-list {
  padding: 0;
}

.line {
  inline-size: 80%;
  margin-inline: auto;
  margin-block: .75rem;
  height: 1px;
  background-color: grey;
}
</style>
