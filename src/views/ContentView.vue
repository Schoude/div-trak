<script setup lang='ts'>
import AppBar from '@/components/layout/AppBar.vue';
import BottomBar from '@/components/layout/BottomBar.vue';
import { useDividendsScrapedStore } from '@/stores/dividends-scraped';
import { useExchangeRatesStore } from '@/stores/exchange-rates';
import { onBeforeMount } from 'vue';

const dividendsScrapedStore = useDividendsScrapedStore();
const exchangeRatesStore = useExchangeRatesStore();

onBeforeMount(async () => {
  try {
    await Promise.all([
      exchangeRatesStore.loadExchangeRates(),
      dividendsScrapedStore.loadScrapedDividends(),
    ]);
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <AppBar />

  <div class="content-view">
    <RouterView />
  </div>

  <BottomBar />
</template>

<style lang='scss' scoped>
.content-view {
  overflow-y: auto;

  @media only screen and (width >=1440px) {
    inline-size: 1280px;
    margin-inline: auto;
  }
}
</style>
