<script setup lang='ts'>
import { useAlphaVantageStore } from '@/stores/alphavantage';
import type { ArticleNewsSentiment } from '@/types/alphavantage';
const alphaVantage = useAlphaVantageStore();

defineProps<{
  article: ArticleNewsSentiment
}>();
</script>

<template>
  <article class="article-sentiment-news">
    <header>
      <img v-if="article.banner_image" class="image-article" :src="article.banner_image" :alt="article.title" />
      <a class="link-article" :href="article.url" target="_blank" rel="noopener">
        <h3 class="title">{{ article.title }}</h3>
      </a>
    </header>

    <div class="body">
      <div class="meta-data">
        <i class="date">
          At {{ alphaVantage.getAlphavantageDate(article.time_published).toLocaleString() }}
        </i>
        <div class="sentiment-data">
          <span class="sentiment-label" :class="article.overall_sentiment_label.toLowerCase()">{{
            article.overall_sentiment_label }}</span>
          <span>{{ article.overall_sentiment_score }}</span>
        </div>
      </div>

      <p class="summary">{{ article.summary }}</p>

      <hr />

      <div class="box">
        <h3 class="sub-headline">Topics</h3>
        <div class="inner">
          <div class="topic" v-for="topic of article.topics" :key="topic.topic">
            <p class="topic-label">{{ topic.topic }}</p>
            <p class="relevance-score">Relevance: {{ topic.relevance_score }}</p>
          </div>
        </div>
      </div>

      <div class="box">
        <h3 class="sub-headline">Ticker Sentiments</h3>
        <div class="inner">
          <div class="ticker" v-for="ticker of article.ticker_sentiment" :key="ticker.ticker">
            <p class="ticker-label">{{ ticker.ticker }}</p>
            <p class="relevance-score">Relevance: {{ ticker.relevance_score }}</p>
            <p class="sentiment-score">
              Sentiment: {{ ticker.ticker_sentiment_score }}
            </p>
            <p class="sentiment-label" :class="ticker.ticker_sentiment_label.toLowerCase()">
              {{ ticker.ticker_sentiment_label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.article-sentiment-news {
  container-type: inline-size;
}

article {
  border: 1px solid rgb(48, 48, 48);
  transition: background-color 150ms ease-out;
  box-shadow: var(--shadow);
  background-image: var(--gradient-sky-transparent);
  background-repeat: no-repeat;
}

header {
  display: grid;
  grid-template-columns: 1fr;
  isolation: isolate;

  .image-article {
    /* The filter messes with the visibility of the text even though the text is above the image. */
    inline-size: 100%;
    z-index: -1;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.15) blur(4px);
    grid-area: 1 / 1;
  }

  .image-article {
    @container (inline-size > 350px) {
      aspect-ratio: 2.5 / 1;
    }
  }

  .link-article {
    grid-area: 1 / 1;
    padding: 0.5rem;
    font-size: 1.25rem;
  }
}

.link-article {
  .title {
    text-wrap: balance;
  }

  &:hover {
    text-decoration: underline;
  }
}

.body {
  padding: 0.98rem 1rem;
}

.meta-data {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  margin-block-end: 0.35rem;
  font-size: 0.9rem;
}

.sentiment-data {
  justify-content: emd;
  display: flex;
  gap: 1rem;
}

.summary {
  text-align: justify;
  text-wrap: pretty;
}

.sub-headline,
hr {
  margin-block: .75rem;
}

.box {
  margin-block-end: 0.5rem;

  .inner {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.9rem;

    >div {
      border: 1px hsl(0, 0%, 30%) dotted;
      padding: 0.1rem 0.2rem;
    }
  }

  &+& {
    margin-block-end: 0;
  }
}

.sentiment-news-ticker {
  display: inline-block;
}

.sentiment-label {
  letter-spacing: 0.5px;

  &.bullish {
    font-weight: 500;
    color: var(--green);
  }

  &.somewhat-bullish {
    color: var(--green-darker);
  }

  &.bearish {
    font-weight: 500;
    color: var(--red);
  }

  &.somewhat-bearish {
    color: var(--red);
  }
}
</style>
