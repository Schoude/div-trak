<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import type { Instrument } from '@/types/tr/instrument';
import { computed, ref } from 'vue';

const props = defineProps<{
  isInDetailPortfolio: boolean;
  amountOwned: number;
  instrument: Instrument;
  portfolioName: string;
}>();

const dialogOrder = ref<typeof ModalBase | null>(null);

const amountOrder = ref<number | null>(null);
const isSending = ref(false);

function onDialogOpenClick () {
  dialogOrder.value?.$el.showModal();
}

function onDialogClose () {
  amountOrder.value = 0;
}

const canSell = computed(() => props.amountOwned > 0 && amountOrder.value! <= props.amountOwned);
const canSend = computed(() => amountOrder.value! > 0 && !isSending.value);

async function onSellClick () {
  isSending.value = true;

  try {
    // const res = '';
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isSending.value = false;
    dialogOrder.value?.$el.close();
    onDialogClose();
  }
}
async function onBuyClick () {
  isSending.value = true;

  try {
    // const res = '';
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isSending.value = false;
    dialogOrder.value?.$el.close();
    onDialogClose();
  }
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

        <template v-if="isInDetailPortfolio">
          <p class="text-s">You currenty own {{ amountOwned }} pcs. of <b>{{ instrument.instrument.shortName }}</b> in
            portfolio <b>{{ portfolioName }}</b>.
          </p>
        </template>

        <template v-else>
          <p class="text-s">You currenty own {{ amountOwned }} pcs. of <b>{{ instrument.instrument.shortName }}</b></p>
        </template>

        <form class="order-form">
          <div class="wrapper">
            <button @click="onSellClick" type="button" class="button-sell" :disabled="!canSell || !canSend">Sell</button>
            <input v-model.number="amountOrder" placeholder="0" type="number" name="amount" id="amount" min="0">
            <button @click="onBuyClick" type="button" class="button-buy" :disabled="!canSend">Buy</button>
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
      filter: saturate(.5);
      transition: background-color .35s ease-out;

      &:hover,
      &:focus-visible {
        filter: saturate(.85);
      }

      &:disabled {
        background-color: #484848;
        cursor: not-allowed;
      }
    }

    .button-sell {
      border-start-start-radius: 50px;
      border-end-start-radius: 50px;
      background-color: var(--color-bearish);
      transition: filter .35s ease-out;
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