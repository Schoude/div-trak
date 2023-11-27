<script setup lang="ts">
import type { TickerEvent } from '@/types/tr/events/ticker';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';

const props = defineProps<{
  ticker: TickerEvent;
}>();

const priceDifferenceAbsolute = computed(() => +props.ticker.bid.price - +props.ticker.pre.price);
const priceDifferenceAbsoluteLabel = computed(() => formatNumber(priceDifferenceAbsolute.value, { style: 'currency', currency: 'EUR', roundingMode: 'floor' }));
const priceDifferencePercentage = computed(() => `${formatNumber(priceDifferenceAbsolute.value / +props.ticker.bid.price * 100, { style: 'decimal', roundingMode: 'floor' })} %`);
const priceDifferenceSentiment = computed(() => priceDifferenceAbsolute.value >= 0 ? 'sentiment-bullish' : 'sentiment-bearish');
</script>

<template>
  <div class="instrument-price-info">
    <div class="price text-m">{{ formatNumber(+ticker.bid.price, {
      style: 'currency', currency: 'EUR', roundingMode:
        'floor'
    }) }}</div>
    <div class="price-difference text-xs" :class="priceDifferenceSentiment">
      <div>{{ priceDifferenceAbsoluteLabel }}</div>
      <div>({{ priceDifferencePercentage }})</div>
    </div>
  </div>
</template>