<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import TagText from '@/components/display/TagText.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import { useDividendsScrapedStore } from '@/stores/dividends-scraped';
import { useInstrumentsStore } from '@/stores/instruments';
import type { Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed, ref } from 'vue';

defineProps<{
  dividends: Dividend[];
  frequency: string;
  yield: string;
}>();

const instruments = useInstrumentsStore();
const dividendsScrapedStore = useDividendsScrapedStore();

const modalConfirmation = ref<typeof ModalBase | null>(null);
const estimatedDividendToDelete = ref<Dividend | null>(null);
const estimatedDividendToDeleteInstrument = computed(() => instruments.getInstrument(estimatedDividendToDelete.value?.isin!));

const isSending = ref(false);
const canSend = computed(() => !isSending.value && estimatedDividendToDelete.value != null);

function onEstimatedDividendDelete (estimatedDividend: Dividend) {
  estimatedDividendToDelete.value = estimatedDividend;
  modalConfirmation.value?.$el.showModal();
}

function clearDeletionEstimatedDividend () {
  estimatedDividendToDelete.value = null;
}

function clearAndClose () {
  modalConfirmation.value?.$el.close();
  clearDeletionEstimatedDividend();
}

function onDeletionCancelClick () {
  clearAndClose();
}

async function onDeletionConfirmClick () {
  if (!canSend.value) {
    return;
  }

  isSending.value = true;

  try {
    await dividendsScrapedStore.deleteEstimatedDividend(`${estimatedDividendToDelete.value?.isin}-${estimatedDividendToDelete.value?.exDate}`);
    clearAndClose();
  } catch (error) {
    console.error(error);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <div class="dividends-list">
    <h2 class="text-m">
      <slot name="title" />
    </h2>

    <div class="wrapper">
      <TagText class="frequency">
        {{ frequency }} • {{ yield }}
      </TagText>
      <slot name="action-dividendhistory" />
    </div>

    <ul>
      <DividendListItem v-for="dividend of dividends" :key="dividend.id" :dividend="dividend"
        @delete:estimated-dividend="onEstimatedDividendDelete" />
    </ul>

    <ModalBase ref="modalConfirmation" @close="onDeletionCancelClick">
      <template #title>Confirm deletion</template>

      <template #content>
        <div class="confirmation">
          <p class="text-s">Do you really want to delete this estimated dividend?</p>

          <div class="dividend-description text-m">
            <div class="instrument">{{ estimatedDividendToDeleteInstrument?.instrument?.shortName }}</div>
            <div class="text-s amount">Amount paid: {{ formatNumber(estimatedDividendToDelete?.amount!, {
              style:
                'currency', currency: 'USD'
            })
            }} </div>
            <div class="text-s ex-date">Ex Date: {{ new Date(estimatedDividendToDelete?.exDate!).toLocaleDateString() }}
            </div>
            <div class="text-s payment-date">Payment Date: {{ new
              Date(estimatedDividendToDelete?.paymentDate!).toLocaleDateString() }}
            </div>
          </div>

          <div class="actions">
            <ButtonAction class="button-confirmation text-s" variant="dusk" @click="onDeletionCancelClick">
              Cancel
            </ButtonAction>
            <ButtonAction class="button-confirmation text-s" variant="dawn" @click="onDeletionConfirmClick">
              Confirm Deletion
            </ButtonAction>
          </div>
        </div>
      </template>
    </ModalBase>
  </div>
</template>

<style lang='scss' scoped>
.dividends-list {
  margin-block: 1.35rem;
}

h2 {
  margin-block-end: 0.35rem;
}

.frequency {
  block-size: max-content;
}

ul {
  padding: 0;
  padding-block-end: .85rem;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-block-end: 0.7rem;
}

.confirmation {
  padding-inline: .5rem;
}

.dividend-description {
  margin-block: 1.125rem;
  display: grid;
  place-content: center;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-block-end: 1.125rem;
}

.button-confirmation {
  block-size: 2.5rem;
}

.modal-base {
  max-inline-size: 500px;
}
</style>
