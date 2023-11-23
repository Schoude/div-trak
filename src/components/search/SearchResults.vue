<script setup lang='ts'>
import { useNeonSearchStore } from '@/stores/neon-search';

const search = useNeonSearchStore();

</script>

<template>
<section class="search-results">
  <article class="result results-stocks">
    <h2 class="title text-l">Stocks</h2>
    <div class="result stock text-m" v-for="stock of search.searchResultsStocks" :key="stock.isin">{{ stock.name }}</div>
  </article>

  <div class="line"></div>

  <article class="result results-etfs">
    <h2 class="title text-l">ETFs</h2>
    <div class="result etf text-m" v-for="etf of search.searchResultsETFs" :key="etf.isin">{{ etf.name }}</div>
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
  max-block-size: 500px;
  border: 1px solid rgb(48, 48, 48);
  border-radius: 8px;
  box-shadow: var(--shadow);
  background-color: rgb(10, 10, 10);

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--gradient-page);
    background-repeat: no-repeat;
  }
}

.title {
  margin: 1.25rem;
}

.line {
  inline-size: 80%;
  margin-inline: auto;
  margin-block: .75rem;
  height: 1px;
  background-color: grey;
}
</style>
