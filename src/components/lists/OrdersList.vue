<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import OrderListItem from '@/components/lists/OrderListItem.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { supabase } from '@/supabase/client';
import type { DbResult, Order, Portfolio } from '@/supabase/types/helpers';
import { computed, ref } from 'vue';

const props = defineProps<{
  orders: Order[];
  portfolio: Portfolio;
}>();

const authStore = useAuthStore();
const instruments = useInstrumentsStore();
const modalConfirmation = ref<typeof ModalBase | null>(null);

const orderToDelete = ref<Order | null>(null);
const orderToDeleteInstrument = computed(() => instruments.getInstrument(orderToDelete.value?.isin!));
const isLastOrderInPortfolio = computed(() => props.orders.length === 1);

const isSending = ref(false);
const canSend = computed(() => !isSending.value && orderToDelete.value != null);

function clearDeletionOrder () {
  orderToDelete.value = null;
}

function onOrderDeleteClick (order: Order) {
  orderToDelete.value = order;
  modalConfirmation.value?.$el.showModal();
}

function clearAndClose () {
  modalConfirmation.value?.$el.close();
  clearDeletionOrder();
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
    // Delete order for instrument
    const deleteOrderQuery = supabase
      .from('orders')
      .delete()
      .eq('id', orderToDelete.value!.id);
    const deleteOrderResult: DbResult<typeof deleteOrderQuery> = await deleteOrderQuery;

    if (deleteOrderResult.error) throw deleteOrderResult.error;

    // Delete instrument from port
    if (isLastOrderInPortfolio.value) {
      const selectPortfolioQuery = supabase
        .from('portfolios')
        .select('isins')
        .eq('id', props.portfolio.id)
        .single();

      const selectPortfolioResult: DbResult<typeof selectPortfolioQuery> =
        await selectPortfolioQuery;

      if (selectPortfolioResult.error) throw selectPortfolioResult.error;

      const isins = selectPortfolioResult.data.isins.filter(isin => isin !== orderToDelete.value!.isin);

      const updatePortfolioQuery = supabase
        .from('portfolios')
        .update({ isins })
        .eq('id', props.portfolio.id)
        .single();
      const uptedPortfolioResult: DbResult<typeof updatePortfolioQuery> =
        await updatePortfolioQuery;

      if (uptedPortfolioResult.error) throw uptedPortfolioResult.error;
    }

    await authStore.checkSession();
    clearAndClose();
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <div class="orders-list">
    <h2 class="text-m">Orders in Portfolio <small>({{ portfolio.name }})</small></h2>
    <ul>
      <OrderListItem v-for="(order, index) of orders" :key="index" :order="order" @delete="onOrderDeleteClick" />
    </ul>

    <ModalBase ref="modalConfirmation" @close="onDeletionCancelClick">
      <template #title>Confirm deletion</template>

      <template #content>
        <div class="confirmation">
          <p class="text-s">Do you really want to delete this order?</p>

          <div class="order-description text-m">
            <div class="instrument">{{ orderToDeleteInstrument?.instrument?.shortName }}</div>
            <div class="amount">{{ orderToDelete?.amount }} pcs. @ {{ new
              Date(orderToDelete?.executed_at!).toLocaleDateString() }}</div>
            <div class="type">Type: {{ orderToDelete?.execution_type }}</div>
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

<style scoped lang="scss">
.orders-list {
  margin-block: 1.35rem;
}

h2 {
  margin-block-end: 0.35rem;
}

ul {
  padding: 0;
  padding-block-end: .85rem;
  list-style: none;
  display: flex;
  gap: .5rem;
  overflow-x: auto;
}

.confirmation {
  padding-inline: .5rem;
}

.order-description {
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
