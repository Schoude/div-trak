<script setup lang="ts">
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/supabase/client';
import type { DbResult, ORDER_EXECUTION_TYPE, OrderNew, Portfolio } from '@/supabase/types/helpers';
import type { ETF, Stock } from '@/types/tr/instrument';
import { computed, ref } from 'vue';

const amountOrder = ref<number | null>(null);
const dateOrder = ref('');
const executionType = ref<ORDER_EXECUTION_TYPE>('normal');

const isSending = ref(false);

const props = defineProps<{
  amountOwned: number;
  instrument: Stock | ETF;
  portfolio: Portfolio;
  isInDetailPortfolio: boolean;
}>();

const emit = defineEmits(['success']);

const authStore = useAuthStore();

function onSuccess () {
  amountOrder.value = null;
  dateOrder.value = '';
  executionType.value = 'normal';
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
    // Add instrument to portfolio
    if (props.isInDetailPortfolio === false) {
      const selectPortfolioQuery = supabase
        .from('portfolios')
        .select('isins')
        .eq('id', newOrder.portfolio_id)
        .single();

      const selectPortfolioResult: DbResult<typeof selectPortfolioQuery> =
        await selectPortfolioQuery;

      if (selectPortfolioResult.error) throw selectPortfolioResult.error;

      const isins = selectPortfolioResult.data.isins;

      isins?.push(newOrder.isin);

      const updatePortfolioQuery = supabase
        .from('portfolios')
        .update({ isins })
        .eq('id', newOrder.portfolio_id)
        .single();
      const uptedPortfolioResult: DbResult<typeof updatePortfolioQuery> =
        await updatePortfolioQuery;

      if (uptedPortfolioResult.error) throw uptedPortfolioResult.error;
    }

    // Add new order for instrument
    const createOrderQuery = supabase.from('orders').insert(newOrder);
    const createOrderResult: DbResult<typeof createOrderQuery> =
      await createOrderQuery;

    if (createOrderResult.error) throw createOrderResult.error;

    await authStore.checkSession();

    onSuccess();
    emit('success');
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <form class="form-order" @submit.prevent="">
    <div class="row">
      <LabelFormInput for-input="order-date" text="Execution Date">
        <input v-model="dateOrder" type="date" name="order-date" id="order-date">
      </LabelFormInput>

      <!-- TODO: make into component SelectRadio -->
      <fieldset class="select-radio">
        <legend>Execution Type</legend>
        <div class="controls">
          <div class="field">
            <input v-model="executionType" type="radio" name="order-execution-type" id="execution-type-normal"
              value="normal" checked>
            <label class="tag-radio text-s" for="execution-type-normal">normal</label>
          </div>

          <div class="field">
            <input v-model="executionType" type="radio" name="order-execution-type" id="execution-type-forecast"
              value="forecast">
            <label class="tag-radio text-s" for="execution-type-forecast">forecast</label>
          </div>
        </div>
      </fieldset>
    </div>

    <div class="row">
      <div class="wrapper">
        <button @click="onOrderClick('sell')" type="button" class="button-sell"
          :disabled="!canSell || !canSend">Sell</button>
        <input v-model.number="amountOrder" placeholder="0" type="number" name="amount" id="amount" min="0">
        <button @click="onOrderClick('buy')" type="button" class="button-buy" :disabled="!canSend">Buy</button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.form-order {
  margin-block: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  margin-block-start: 1.125rem;

  .label-form-input {
    margin: 0;
  }
}

.wrapper {
  grid-column: 1 / -1;
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
    box-shadow: var(--shadow);

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

.select-radio {
  border: none;
  padding: 0;
  outline: 1px solid transparent;
  outline-offset: 6px;
  transition: outline 150ms ease-out;

  @media only screen and (width < 768px) {
    &:focus-within {
      outline: 1px solid rgba(255, 255, 255, 0.35);
    }
  }

  legend {
    margin-block-end: .5rem;
  }

  .controls {
    display: flex;
    gap: .5rem;

    label {
      color: var(--color-muted);
      transition: color .35s ease-out, border-color .35s ease-out;
      cursor: pointer;
    }
  }

  input[type="radio"] {
    appearance: none;

    &:checked+.tag-radio {
      color: var(--color-accent-1);
      border-color: var(--color-accent-1);
    }
  }

  .tag-radio {
    color: var(--color-muted);
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid rgb(48, 48, 48);
    padding: .25rem .45rem;
    line-height: 1;
    border-radius: 50px;
  }
}
</style>
