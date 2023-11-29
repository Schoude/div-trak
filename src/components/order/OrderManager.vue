<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import FormOrder from '@/components/forms/FormOrder.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import type { Portfolio } from '@/supabase/types/helpers';
import type { Instrument } from '@/types/tr/instrument';
import { ref } from 'vue';

defineProps<{
  amountOwned: number;
  instrument: Instrument;
  portfolio: Portfolio;
  isInDetailPortfolio: boolean;
}>();

const dialogOrder = ref<typeof ModalBase | null>(null);

function onDialogOpenClick () {
  dialogOrder.value?.$el.showModal();
}

function onDialogClose () {
  dialogOrder.value?.$el.close();
}

function onSuccess () {
  onDialogClose();
}
</script>

<template>
  <ButtonAction class="button-order-modal" variant="dawn" @click="onDialogOpenClick">Place Order</ButtonAction>

  <ModalBase ref="dialogOrder" @close="onDialogClose">
    <template #title>
      Place an order
    </template>

    <template #content>
      <section class="content">

        <p class="text-l instrument">{{ instrument.instrument.shortName }}</p>

        <p class="text-s">You currenty own {{ amountOwned }} pcs. of <b>{{ instrument.instrument.shortName }}</b> in
          portfolio <b>{{ portfolio.name }}</b>.
        </p>

        <FormOrder @success="onSuccess" :amount-owned="amountOwned" :instrument="instrument"
          :is-in-detail-portfolio="isInDetailPortfolio" :portfolio="portfolio" />
      </section>
    </template>
  </ModalBase>
</template>

<style scoped lang="scss">
.button-order-modal {
  inline-size: 60%;
  margin-inline: auto;
  block-size: 2.5rem;
}

.content {
  padding-inline: .5rem;

  p {
    margin-block: .5rem 1rem;
  }
}
</style>
