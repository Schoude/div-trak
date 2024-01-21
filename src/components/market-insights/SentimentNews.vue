<script setup lang='ts'>
import { useAlphaVantageStore } from '@/stores/alphavantage';
const alphaVantage = useAlphaVantageStore();

const news = await alphaVantage.getSentimentNews();
</script>

<template>
  <div class="sentiment-news">
    <section>{{ news?.articlesBullish }}</section>
    <section>{{ news?.articlesBearish }}</section>
  </div>
</template>

<style lang='scss' scoped>
</style>
