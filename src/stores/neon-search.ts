import type {
  ETFSearchResult,
  NeonSearchResults,
  StockSearchResult,
} from '@/types/tr/neon-search';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNeonSearchStore = defineStore('neon-search', () => {
  const searchResultsStocks = ref<StockSearchResult[]>([]);
  const searchResultsETFs = ref<ETFSearchResult[]>([]);

  function handleSearchEvent (results: NeonSearchResults, eventId: number) {
    switch (eventId) {
      case 1: {
        searchResultsStocks.value = results;
        break;
      }

      case 2: {
        searchResultsETFs.value = results as ETFSearchResult[];
        break;
      }
    }
  }

  return {
    handleSearchEvent,
    searchResultsStocks,
    searchResultsETFs,
  };
});
