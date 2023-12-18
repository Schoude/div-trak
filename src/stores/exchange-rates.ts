import { supabase } from '@/supabase/client';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

export const useExchangeRatesStore = defineStore('exchange-rates', () => {
  const exchangeRates = reactive({
    USD_EUR: 0,
    EUR_USD: 0,
  });

  const dataLoaded = computed(() => exchangeRates.EUR_USD > 0 || exchangeRates.USD_EUR > 0);

  return {
    async loadExchangeRates () {
      if (dataLoaded.value) {
        return;
      }

      try {
        const exchangeRatesResult = await supabase.functions.invoke<{
          USD_EUR: number;
          EUR_USD: number;
        }>('exchange-rate-scrape');

        if (exchangeRatesResult.error) {
          throw exchangeRatesResult.error;
        }

        exchangeRates.USD_EUR = exchangeRatesResult.data?.USD_EUR!;
        exchangeRates.EUR_USD = exchangeRatesResult.data?.EUR_USD!;
      } catch (error) {
        console.error(error);
      }
    },
    exchangeRates,
  };
});
