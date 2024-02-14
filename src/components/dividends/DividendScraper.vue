<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import { supabase } from '@/supabase/client';
import type { DividendsCrawlReturnType } from '@/supabase/types/functions';
import type { Dividend } from '@/types/tr/events/stock-details';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  isLoading: boolean;
  stockName: string;
}>();

const emit = defineEmits<{
  loading: [isLoading: boolean];
  'update:scraped-dividends': [dividends: Dividend[]];
  scrapeCompleted: [boolean];
}>();

const baseUrl = 'https://dividendhistory.org';
const symbolToScrape = ref('');

const canScrapeDividends = computed(() => !props.isLoading && symbolToScrape.value !== '');
const urlToScrape = computed(() => `${baseUrl}/payout/${symbolToScrape.value}`);

watch(symbolToScrape, () => {
  symbolToScrape.value = symbolToScrape.value.toUpperCase();
});

onUnmounted(() => {
  symbolToScrape.value = '';
});

async function onScrapeSubmit () {
  emit('loading', true);

  try {
    const crawlDividendsResponse = await supabase
      .functions
      .invoke<DividendsCrawlReturnType>('dividends-crawl', {
        body: {
          url: urlToScrape.value,
        },
      });

    if (crawlDividendsResponse.error) throw crawlDividendsResponse.error;

    if (crawlDividendsResponse.data) {
      // @ts-expect-error bad DOM types
      document.startViewTransition(async () => {
        // Emit values for successful crawl
        emit('update:scraped-dividends', crawlDividendsResponse.data.estimatedDividends);
        emit('scrapeCompleted', true);

        await nextTick();
      });
    } else throw new Error('Response has no data: Function: dividends-crawl');

    if (!crawlDividendsResponse.data?.estimatedDividends) {
      console.error(`Error crawling the estimated dividends for ${props.stockName} (${symbolToScrape.value})`);

      return;
    }

  } catch (error) {
    console.error(error);
  } finally {
    emit('loading', false);
  }
}
</script>

<template>
  <div class="dividend-scraper">
    <iframe :src="baseUrl" frameborder="0"></iframe>

    <form class="form-crawl-dividends" @submit.prevent="onScrapeSubmit">
      <InputText id="symbol-name" v-model.trim="symbolToScrape" placeholder="Symbol to crawl i.e. MSFT"
        autocomplete="off" />
      <ButtonAction variant="dawn" :disabled="!canScrapeDividends">
        Crawl Dividends
      </ButtonAction>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.dividend-scraper {
  display: flex;
  flex-direction: column;

  iframe {
    flex: 1;
  }
}

.form-crawl-dividends {
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

@container modal-dividend-history (width > 768px) {
  .form-crawl-dividends {
    padding: 2rem;
    grid-template-rows: 1fr;
    grid-template-columns: 15% 1fr;
    gap: 2rem;
  }
}
</style>
