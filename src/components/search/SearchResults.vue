<script setup lang='ts'>
import { useNeonSearchStore } from '@/stores/neon-search';
import IconClose from '../icons/IconClose.vue';
import SearchResultListItem from './SearchResultListItem.vue';

const search = useNeonSearchStore();

defineEmits([
  'hide',
  'hide:navigation'
]);
</script>

<template>
  <section class="search-results">
    <article class="result results-stocks">
      <h2 class="title text-l">Stocks</h2>
      <ul class="results-list">
        <SearchResultListItem v-for="stock of search.searchResultsStocks" :result="stock" :key="stock.isin"
          @hide:navigation="$emit('hide:navigation')" />
      </ul>
    </article>

    <div class="line"></div>

    <article class="result results-etfs">
      <h2 class="title text-l">ETFs</h2>
      <ul class="results-list">
        <SearchResultListItem v-for="etf of search.searchResultsETFs" :result="etf" :key="etf.isin"
          @hide:navigation="$emit('hide:navigation')" />
      </ul>
    </article>

    <button class="btn-close" type="button" title="Hide search results" @click="$emit('hide')">
      <IconClose />
    </button>
  </section>
</template>

<style lang='scss' scoped>
@use '../../styles/mixins';

.search-results {
  position: absolute;
  inset-block-end: 140%;
  inline-size: 95vw;
  // TODO: desktop - should be a bit bitter than the input field > 420px

  min-block-size: 400px;
  // TODO: desktop - could be much higher
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

.btn-close {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0px;
  padding: .48rem .48rem;
  transition: scale 150ms ease-out;

  &:hover,
  &:focus-visible {
    scale: 1.08;

    .icon-close {
      fill: white;
    }
  }

  .icon-close {
    transition: fill 250ms ease-out;
    fill: rgba(255, 255, 255, 0.3);
  }
}
</style>
