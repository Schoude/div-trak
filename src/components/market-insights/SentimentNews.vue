<script setup lang='ts'>
import { useAlphaVantageStore } from '@/stores/alphavantage';
import ArticleSentimentNews from './ArticleSentimentNews.vue';
const alphaVantage = useAlphaVantageStore();

const news = await alphaVantage.getSentimentNews();
</script>

<template>
  <div class="sentiment-news">
    <section class="news-section">
      <h2>Bullish News</h2>
      <ArticleSentimentNews v-for="article of news?.articlesBullish" :article="article" :key="article.title" />
    </section>
    <section class="news-section">
      <h2>Bearish News News</h2>
      <ArticleSentimentNews v-for="article of news?.articlesBearish" :article="article" :key="article.title" />
    </section>
  </div>
</template>

<style lang='scss' scoped>
</style>
