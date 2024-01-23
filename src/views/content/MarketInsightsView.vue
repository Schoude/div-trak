<script setup lang='ts'>
import SentimentNewsLoader from '@/components/market-insights/SentimentNewsLoader.vue';
import StockMovers from '@/components/market-insights/StockMovers.vue';
// import TrendingStocksLoader from '@/components/market-insights/TrendingStocksLoader.vue';
</script>

<template>
  <main class="market-insights-view view">
    <h1>Market Insights</h1>

    <!-- <TrendingStocksLoader /> -->

    <StockMovers />

    <SentimentNewsLoader />
  </main>
</template>

<style lang='scss' scoped>
</style>
