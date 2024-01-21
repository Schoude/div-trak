<script setup lang='ts'>
import { onErrorCaptured, ref } from 'vue';
import SentimentNews from './SentimentNews.vue';

const hasError = ref(false);

onErrorCaptured((e) => {
  console.log(e);
  hasError.value = true;
});
</script>

<template>
  <div class="sentiment-news-loader">
    <Suspense>

      <template #default>
        <SentimentNews />
      </template>

      <template #fallback>
        <p v-if="!hasError">Loading Sentiment News</p>
        <template v-else>
          <p>Error loading the AlphaVantage Sentiment News</p>
        </template>
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped>
</style>
