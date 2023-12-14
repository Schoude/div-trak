<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import { supabase } from '@/supabase/client';
import type { DividendsCrawlReturnType } from '@/supabase/types/functions';
import type { Dividend } from '@/types/tr/events/stock-details';
import { computed, nextTick, ref, watch } from 'vue';

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);

const baseUrl = 'https://dividendhistory.org/payout';
const symbolToCrawl = ref('');
const isLoading = ref(false);
const crawlCompleted = ref(false);
const crawledDividends = ref<Dividend[]>([]);

watch(symbolToCrawl, () => {
  symbolToCrawl.value = symbolToCrawl.value.toUpperCase();
});

const props = defineProps<{
  stockName: string;
}>();

defineExpose({
  onOpenIframeModalOpen,
});

const canCrawlDividends = computed(() => !isLoading.value && symbolToCrawl.value !== '');
const canConfirmDividends = computed(() => !isLoading.value && crawlCompleted.value && crawledDividends.value.length > 0);
const urlToCrawl = computed(() => `${baseUrl}/${symbolToCrawl.value}`);

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

async function onCrawlSubmit () {
  isLoading.value = true;
  try {
    const crawlDividendsResponse = await supabase.functions.invoke<DividendsCrawlReturnType>('dividends-crawl', {
      body: {
        url: urlToCrawl.value,
      },
    });

    if (crawlDividendsResponse.error) throw crawlDividendsResponse.error;

    if (crawlDividendsResponse.data) {
      // @ts-expect-error bad DOM types
      document.startViewTransition(async () => {
        // Set values for successful crawl
        crawlCompleted.value = true;
        crawledDividends.value = crawlDividendsResponse.data.estimatedDividends;

        await nextTick();
      });
    } else throw new Error('Response has no data: Function: order-delete');

    if (!crawlDividendsResponse.data?.estimatedDividends) {
      console.error(`Error crawling the estimated dividends for ${props.stockName} (${symbolToCrawl.value})`);

      return;
    }

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function resetValues () {
  symbolToCrawl.value = '';
  isLoading.value = false;
  crawlCompleted.value = false;
  crawledDividends.value = [];
}
</script>

<template>
  <ModalBase class="modal-dividend-history" ref="root" @close="onOpenIframeModalClose" @open="onOpenIframeModalOpen">
    <template #title>dividendhistory.org | {{ stockName }}</template>
    <template #content>
      <div v-if="modalIsOpen" class="inner">
        <!-- TODO: move into component -->
        <div v-if="!crawlCompleted" class="dividend-finder">
          <iframe :src="baseUrl" frameborder="0"></iframe>

          <form class="form-crawl-dividends" @submit.prevent="onCrawlSubmit">
            <InputText id="symbol-name" v-model.trim="symbolToCrawl" placeholder="Symbol to crawl i.e. MSFT"
              autocomplete="off" />
            <ButtonAction variant="dawn" :disabled="!canCrawlDividends">
              Crawl Dividends
            </ButtonAction>
          </form>
        </div>

        <!-- TODO: move into component -->
        <div v-else class="dividend-confirmation">
          <div class="crawled-dividends">
            <ul>
              <DividendListItem v-for="dividend of crawledDividends" :dividend="dividend" :key="dividend.id">
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

.dividend-finder {
  flex: 1;
  display: flex;
  flex-direction: column;
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
