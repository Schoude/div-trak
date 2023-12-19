<script setup lang='ts'>
import IconDelete from '@/components/icons/IconDelete.vue';
import DividendInfo from '@/components/instrument/DividendInfo.vue';
import type { Dividend, DividendWithPayment } from '@/types/tr/events/stock-details';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    dividend: Dividend | DividendWithPayment;
    showDeleteButton?: boolean;
  }>(), {
  showDeleteButton: true,
},
);

defineEmits<{
  'delete:estimated-dividend': [estimatedDividend: Dividend],
}>();

const isPastDividend = computed(() => {
  const now = Date.now();
  const paymentDate = new Date(props.dividend.paymentDate).getTime();

  return now >= paymentDate ? 'past' : '';
});

const showDeleteButton = computed(() => props.dividend.information === 'estimation' && props.showDeleteButton);
</script>

<template>
  <li class="dividend-list-item" :class="[isPastDividend, dividend.information]">
    <div class="inner">
      <template v-if="'paymentAmount' in dividend">
        <div><b>{{ dividend.paymentAmount }}</b> • <small>({{ dividend.amountAtExDate }} pcs.)</small></div>
        <template v-if="dividend.sourceTax">
          <pre class="text-xs">Source Tax: {{ dividend.sourceTax }}</pre>
        </template>
      </template>

      <DividendInfo v-if="dividend" :dividend="dividend" />

      <slot name="action"></slot>
    </div>

    <button v-if="showDeleteButton" class="button-estimated-dividend-delete" type="button"
      title="Delete estimated dividend" @click="$emit('delete:estimated-dividend', dividend)">
      <IconDelete />
    </button>
  </li>
</template>

<style lang='scss' scoped>
.dividend-list-item {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  list-style: none;
  position: relative;

  &.past {
    border: 1px solid var(--color-bullish);
  }

  &.estimation {
    border: 1px solid rgb(233, 230, 39);
  }
}

.inner {
  inline-size: 220px;
}

.button-estimated-dividend-delete {
  position: absolute;
  inset-block-start: .48rem;
  inset-inline-end: .48rem;
  transition: scale 150ms ease-out;

  &:hover,
  &:focus-visible {
    scale: 1.08;

    .icon-delete {
      fill: var(--color-bearish);
    }
  }

  .icon-delete {
    transition: fill 250ms ease-out;
    fill: rgba(255, 255, 255, 0.3);
  }
}
</style>
