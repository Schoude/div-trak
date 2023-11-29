<script setup lang="ts">
import { useInstrumentsStore } from '@/stores/instruments';
import type { Order } from '@/supabase/types/helpers';
import { computed, ref } from 'vue';
import ButtonAction from '../buttons/ButtonAction.vue';
import ModalBase from '../modals/ModalBase.vue';
import OrderListItem from './OrderListItem.vue';

defineProps<{
  orders: Order[];
  portfolioName: string;
}>();

const instruments = useInstrumentsStore();
const modalConfirmation = ref<typeof ModalBase | null>(null);

const orderToDelete = ref<Order | null>(null);
const orderToDeleteInstrument = computed(() => instruments.getInstrument(orderToDelete.value?.isin!));

function onOrderDeleteClick (order: Order) {
  orderToDelete.value = order;
  modalConfirmation.value?.$el.showModal();
}
</script>

<template>
  <div class="orders-list">
    <h2 class="text-m">Orders in Portfolio <small>({{ portfolioName }})</small></h2>
    <ul>
      <OrderListItem v-for="(order, index) of orders" :key="index" :order="order" @delete="onOrderDeleteClick" />
    </ul>

    <ModalBase ref="modalConfirmation">
      <template #title>
        Confirm deletion
      </template>

      <template #content>
        <div class="confirmation">
          <p class="text-s">Do you really want to delete this order?</p>

          <div class="order-description">
            <div class="instrument">{{ orderToDeleteInstrument?.instrument?.shortName }}</div>
            <div class="amount">{{ orderToDelete?.amount }} pcs. @ {{ new
              Date(orderToDelete?.executed_at!).toLocaleDateString() }}</div>
            <div class="type">Type: {{ orderToDelete?.execution_type }}</div>
          </div>

          <div class="actions">
            <ButtonAction variant="dusk">
              Cancel
            </ButtonAction>
            <ButtonAction variant="dawn">
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
}

.actions {
  display: flex;
  gap: 1rem;
}

.button-action {
  block-size: 40px;
}
</style>