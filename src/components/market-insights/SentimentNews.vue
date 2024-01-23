<script setup lang='ts'>
import { useAlphaVantageStore } from '@/stores/alphavantage';
import ArticleSentimentNews from './ArticleSentimentNews.vue';
const alphaVantage = useAlphaVantageStore();

const news = await alphaVantage.getSentimentNews();
</script>

<template>
  <div class="sentiment-news">
    <section class="news-section" v-if="news?.articlesBullish.length! > 0">
      <h2 class="headline">Bullish News</h2>
      <div class="news-grid">
        <ArticleSentimentNews v-for="article of news?.articlesBullish" :article="article" :key="article.title" />
      </div>
    </section>

    <section class="news-section" v-if="news?.articlesBearish.length! > 0">
      <h2 class="headline">Bearish News</h2>
      <div class="news-grid">
        <ArticleSentimentNews v-for="article of news?.articlesBearish" :article="article" :key="article.title" />
      </div>
    </section>
  </div>
</template>

<style lang='scss' scoped>
.news-section {
  container-type: inline-size;
}

.headline {
  margin-block-start: 1.5rem;
  margin-block-end: .5rem;
}

.news-grid {
  display: grid;
  gap: 1rem;

  @container (inline-size > 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @container (inline-size > 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
