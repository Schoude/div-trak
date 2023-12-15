<script setup lang="ts">
import DividendScrapedConfirmation from '@/components/dividends/DividendScrapedConfirmation.vue';
import DividendScraper from '@/components/dividends/DividendScraper.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import type { Dividend } from '@/types/tr/events/stock-details';
import { nextTick, ref } from 'vue';

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);

const isLoading = ref(false);
const scrapeCompleted = ref(false);
const scrapedDividends = ref<Dividend[]>([]);

defineProps<{
  stockName: string;
  isin: string;
}>();

defineExpose({
  onOpenIframeModalOpen,
});

function onOpenIframeModalOpen () {
  root.value?.$el.showModal();
  modalIsOpen.value = true;
}

function onIframeModalClose () {
  if (isLoading.value) {
    return;
  }

  root.value?.$el.close();
  modalIsOpen.value = false;
  resetValues();
}

function resetValues () {
  isLoading.value = false;
  scrapeCompleted.value = false;
  scrapedDividends.value = [];
}

function onUpdateScrapedDividendAdded (addedDividendExDate: string) {
  // @ts-expect-error bad dom types
  document.startViewTransition(async () => {
    scrapedDividends.value = scrapedDividends.value.filter(dividend => dividend.exDate !== addedDividendExDate);
    await nextTick();
  });
}
</script>

<template>
  <ModalBase class="modal-dividend-history" ref="root" @close="onIframeModalClose" @open="onOpenIframeModalOpen">
    <template #title>dividendhistory.org | {{ stockName }}</template>
    <template #content>
      <div v-if="modalIsOpen" class="inner">
        <DividendScraper v-if="!scrapeCompleted" :is-loading="isLoading" :stock-name="stockName"
          @loading="e => isLoading = e" @scrape-completed="e => scrapeCompleted = e"
          @update:scraped-dividends="e => scrapedDividends = e" />

        <DividendScrapedConfirmation v-else :is-loading="isLoading" :scraped-dividends="scrapedDividends" :isin="isin"
          @update:scraped-dividend-added="onUpdateScrapedDividendAdded($event)" @close="onIframeModalClose" />
      </div>
    </template>
  </ModalBase>
</template>

<style scoped lang="scss">
.modal-dividend-history {
  block-size: 95dvh;
  container-name: modal-dividend-history;
  container-type: inline-size;
}

iframe {
  flex: 1;
  border: 0;
}

.inner {
  display: flex;
}

.dividend-scraper {
  flex: 1;
}

.dividend-scraped-confirmation {
  flex: 1;
}
</style>
