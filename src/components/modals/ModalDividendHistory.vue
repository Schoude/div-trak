<script setup lang="ts">
import ModalBase from '@/components/modals/ModalBase.vue';
import { ref } from 'vue';
import ButtonAction from '../buttons/ButtonAction.vue';

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);

defineProps<{
  stockName: string;
}>();

defineExpose({
  onOpenIframeModalOpen,
});

function onOpenIframeModalOpen () {
  root.value?.$el.showModal();
  modalIsOpen.value = true;
}

function onOpenIframeModalClose () {
  root.value?.$el.close();
  modalIsOpen.value = false;
}

function onCrawlSubmit () {
  console.log('onCrawlSubmit');
}
</script>

<template>
  <ModalBase class="modal-dividend-history" ref="root" @close="onOpenIframeModalClose" @open="onOpenIframeModalOpen">
    <template #title>dividendhistory.org | {{ stockName }}</template>
    <template #content>
      <div v-if="modalIsOpen" class="inner">
        <iframe src="https://dividendhistory.org/payout" frameborder="0"></iframe>

        <form class="actions" @submit.prevent="onCrawlSubmit">
          <input type="text" placeholder="Symbol to crawl: XXX">
          <ButtonAction variant="dawn">
            Crawl unconfirmed/estimated Dividends
          </ButtonAction>
        </form>
      </div>
    </template>
  </ModalBase>
</template>

<style scoped lang="scss">
.modal-dividend-history {
  block-size: 95dvh;
}

iframe {
  flex: 1;
  border: 0;
}

.inner {
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
}
</style>
