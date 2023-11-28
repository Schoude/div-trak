<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import type { Instrument } from '@/types/tr/instrument';
import { computed, ref } from 'vue';

const props = defineProps<{
  amountOwned: number;
  instrument: Instrument;
  portfolioName: string;
}>();

const dialogOrder = ref<typeof ModalBase | null>(null);

const amountOrder = ref(0);

function onDialogOpenClick () {
  dialogOrder.value?.$el.showModal();
}

function onDialogClose () {
  amountOrder.value = 0;
}

const canSell = computed(() => props.amountOwned > 0 && amountOrder.value <= props.amountOwned);
</script>

<template>
  <ButtonAction class="button-order-modal" variant="dawn" @click="onDialogOpenClick">Place Order</ButtonAction>

  <ModalBase ref="dialogOrder" @close="onDialogClose">
    <template #title>
      Place an order
    </template>

    <template #content>
      <section class="content">

        <p class="text-s">You currenty own {{ amountOwned }} pcs. of <b>{{ instrument.instrument.shortName }}</b> in
          portfolio <b>
            {{
              portfolioName }}
          </b>.</p>

        <form class="order-form">
          <div class="wrapper">
            <button type="button" class="button-sell" :disabled="!canSell">Sell</button>
            <input v-model.number="amountOrder" type="number" name="amount" id="amount">
            <button type="button" class="button-buy">Buy</button>
          </div>
        </form>

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

.order-form {
  margin-block: 1rem;

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .button-sell,
    .button-buy {
      text-transform: uppercase;
      text-align: center;
      padding-block: .5rem;
      inline-size: 70px;
      letter-spacing: 1px;
      filter: saturate(.35);

      &:hover,
      &:focus-visible {
        filter: saturate(.85);
      }
    }

    .button-sell {
      border-start-start-radius: 50px;
      border-end-start-radius: 50px;
      background-color: var(--color-bearish);
      transition: filter .35s ease-out;

      &:disabled {
        filter: grayscale(1);
        cursor: not-allowed;
      }
    }

    .button-buy {
      border-start-end-radius: 50px;
      border-end-end-radius: 50px;
      background-color: var(--color-bullish);
    }
  }

  input[type="number"] {
    text-align: center;
    border: none;
    background: transparent;
    inline-size: 36px;
    block-size: 40px;

    &:focus {
      border-block: 1px solid rgb(48, 48, 48);
    }
  }
}
</style>