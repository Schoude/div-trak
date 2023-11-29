<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/supabase/client';
import type { ORDER_EXECUTION_TYPE, OrderNew, Portfolio } from '@/supabase/types/helpers';
import type { User } from '@/types/auth';
import type { Instrument } from '@/types/tr/instrument';
import { computed, ref } from 'vue';

const props = defineProps<{
  amountOwned: number;
  instrument: Instrument;
  portfolio: Portfolio;
  isInDetailPortfolio: boolean;
}>();

const authStore = useAuthStore();

const dialogOrder = ref<typeof ModalBase | null>(null);

const amountOrder = ref<number | null>(null);
const dateOrder = ref('');
const executionType = ref<ORDER_EXECUTION_TYPE>('normal');

const isSending = ref(false);

function onDialogOpenClick () {
  dialogOrder.value?.$el.showModal();
}

function onDialogClose () {
  amountOrder.value = null;
  dateOrder.value = '';
}

const canSell = computed(() => props.amountOwned > 0 && amountOrder.value! <= props.amountOwned);
const canSend = computed(() => amountOrder.value! > 0 && dateOrder.value !== '' && !isSending.value);

async function onOrderClick (type: 'sell' | 'buy') {
  if (!canSend.value) {
    return;
  }

  isSending.value = true;

  const amount = type === 'buy' ? amountOrder.value! : amountOrder.value! * -1;
  const [year, month, day] = dateOrder.value.split('-').map(s => +s);

  const newOrder: OrderNew = {
    day,
    month,
    year,
    executed_at: dateOrder.value,
    portfolio_id: props.portfolio.id,
    amount,
    execution_type: executionType.value,
    isin: props.instrument.instrument.isin,
  };

  try {
    const newOrderRes = await supabase.functions.invoke<{ user: User }>('order-add', {
      body: {
        token: authStore.sessionToken,
        alreadyInPortfolio: props.isInDetailPortfolio,
        order: newOrder,
      }
    });

    if (newOrderRes.error) throw newOrderRes.error;

    if (newOrderRes.data) {
      // Set user with new orders of the portfolios
      authStore.user!.portfolios = newOrderRes.data.user.portfolios;
    } else throw new Error('Response has no data: Function: user-data');

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

        <p class="text-s">You currenty own {{ amountOwned }} pcs. of <b>{{ instrument.instrument.shortName }}</b> in
          portfolio <b>{{ portfolio.name }}</b>.
        </p>

        <form class="order-form">
          <LabelFormInput for-input="order-data" text="Execution Date">
            <input v-model="dateOrder" type="date" name="order-date" id="order-date">
          </LabelFormInput>
          <p>TODO: ADD order type picker</p>

          <div class="wrapper">
            <button @click="onOrderClick('sell')" type="button" class="button-sell"
              :disabled="!canSell || !canSend">Sell</button>
            <input v-model.number="amountOrder" placeholder="0" type="number" name="amount" id="amount" min="0">
            <button @click="onOrderClick('buy')" type="button" class="button-buy" :disabled="!canSend">Buy</button>
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

  input[type="number"],
  input[type="date"] {
    border: none;
    background: transparent;
  }

  input[type="number"] {
    text-align: center;
    border: none;
    background: transparent;
    inline-size: 48px;
    block-size: 40px;

    &:focus {
      border-block: 1px solid rgb(48, 48, 48);
    }
  }
}
</style>
