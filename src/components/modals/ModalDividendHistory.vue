<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import type { Dividend } from '@/types/tr/events/stock-details';
import { computed, ref } from 'vue';
import DividendScraper from '../dividends/DividendScraper.vue';

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);

const isLoading = ref(false);
const scrapeCompleted = ref(false);
const scrapedDividends = ref<Dividend[]>([]);

defineProps<{
  stockName: string;
}>();

defineExpose({
  onOpenIframeModalOpen,
});

const canConfirmDividends = computed(() => !isLoading.value && scrapeCompleted.value && scrapedDividends.value.length > 0);

function onOpenIframeModalOpen () {
  root.value?.$el.showModal();
  modalIsOpen.value = true;
}

function onOpenIframeModalClose () {
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
</script>

<template>
  <ModalBase class="modal-dividend-history" ref="root" @close="onOpenIframeModalClose" @open="onOpenIframeModalOpen">
    <template #title>dividendhistory.org | {{ stockName }}</template>
    <template #content>
      <div v-if="modalIsOpen" class="inner">
        <DividendScraper v-if="!scrapeCompleted" :is-loading="isLoading" :stock-name="stockName"
          @loading="e => isLoading = e" @scrape-completed="e => scrapeCompleted = e"
          @update:scraped-dividends="e => scrapedDividends = e" />

        <!-- TODO: move into component -->
        <div v-else class="dividend-confirmation">
          <div class="crawled-dividends">
            <ul>
              <DividendListItem v-for="dividend of scrapedDividends" :dividend="dividend" :key="dividend.id">
                <template #action>
                  <div class="confirmation">
                    <ButtonAction variant="dawn" :disabled="!canConfirmDividends">
                      Confirm dividend
                    </ButtonAction>
                  </div>
                </template>
              </DividendListItem>
            </ul>
          </div>
        </div>
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

.dividend-confirmation {
  flex: 1;
  display: flex;

  .crawled-dividends {
    display: grid;
    place-content: center;
    flex: 1;

    ul {
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .confirmation {
      margin-block-start: .5rem;
    }
  }
}
</style>
