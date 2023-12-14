<script setup lang="ts">
import ModalBase from '@/components/modals/ModalBase.vue';
import { computed, nextTick, ref, watch } from 'vue';
import ButtonAction from '../buttons/ButtonAction.vue';
import InputText from '../inputs/InputText.vue';

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);

const symbolToCrawl = ref('');
const isLoading = ref(false);
const crawlCompleted = ref(false);
const crawledDividends = ref([]);

watch(symbolToCrawl, () => {
  symbolToCrawl.value = symbolToCrawl.value.toUpperCase();
});

defineProps<{
  stockName: string;
}>();

defineExpose({
  onOpenIframeModalOpen,
});

const canCrawlDividends = computed(() => !isLoading.value && symbolToCrawl.value !== '');
const canConfirmDividends = computed(() => !isLoading.value && crawlCompleted.value && crawledDividends.value.length > 0);

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

function onCrawlSubmit () {
  isLoading.value = true;
  console.log('onCrawlSubmit');

  // @ts-expect-error bad DOM types
  document.startViewTransition(async () => {
    crawlCompleted.value = true;
    await nextTick();
  });

  isLoading.value = false;
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
        <div v-if="!crawlCompleted" class="dividend-finder">
          <iframe src="https://dividendhistory.org/payout" frameborder="0"></iframe>
          <form class="form-crawl-dividends" @submit.prevent="onCrawlSubmit">
            <InputText id="symbol-name" v-model.trim="symbolToCrawl" placeholder="Symbol to crawl i.e. MSFT" />
            <ButtonAction variant="dawn" :disabled="!canCrawlDividends">
              Crawl Dividends
            </ButtonAction>
          </form>
        </div>

        <div v-else class="dividend-confirmation">
          <ButtonAction variant="dawn" :disabled="!canConfirmDividends">
            Confirm dividends
          </ButtonAction>
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
</style>
