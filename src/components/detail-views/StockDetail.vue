<script setup lang="ts">
import AnalystRating from '@/components/instrument/AnalystRating.vue';
import CompanyInfo from '@/components/instrument/CompanyInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import EventsList from '@/components/lists/EventsList.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { Dividend } from '@/types/tr/events/stock-details';
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { Stock } from '@/types/tr/instrument';
import { computed } from 'vue';
import DividendsList from '../lists/DividendsList.vue';

const props = defineProps<{
  stock: Stock;
  ticker: TickerEvent;
}>();

const aggregatedDividends = computed(() => {
  const pastDividends = props.stock.stockDetails?.dividends;
  const eventDividends = props.stock.stockDetails?.events.filter(event => event.dividend);
  const dividendMap = new Map<string, Dividend>();

  // Add newer dividends first
  eventDividends
    .filter(event => event.dividend != null)
    .forEach(event => {
      if (event.dividend) {
        dividendMap.set(event.dividend.id, event.dividend);
      }
    });

  if (props.stock.stockDetails.expectedDividend) {
    dividendMap.set(props.stock.stockDetails.expectedDividend.id, props.stock.stockDetails.expectedDividend);
  }

  // Then add already past dividends
  pastDividends.forEach(dividend => dividendMap.set(dividend.id, dividend));

  return [...dividendMap.values()];
});

const paymentMonths = computed(() => {
  const frequency = props.stock.stockDetails.dividendFrequency;

  const monthsWithPayments = new Set();

  aggregatedDividends.value.forEach(dividend => {
    const paymentDate = new Date(dividend.paymentDate);
    monthsWithPayments.add(paymentDate.getMonth() + 1);
  });

  return `${frequency ?? ''} (${([...monthsWithPayments.values()] as number[]).sort((a, b) => a - b).join('/')})`;
});
</script>

<template>
  <section class="stock-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="stock.instrument.imageId" />
    <h1 class="text-l">{{ stock.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <!-- OrderManager here -->

    <DividendsList :dividends="aggregatedDividends" :frequency="paymentMonths" />

    <AnalystRating :analyst-rating="stock.stockDetails.analystRating" :current-price="+ticker.bid.price" />

    <EventsList :events="stock.stockDetails.events" />

    <CompanyInfo :company="stock.stockDetails.company" :tags="stock.instrument.tags" />
  </section>
</template>

<style lang="scss" scoped>
.image {
  margin-block-end: .5rem;
}

.instrument-price-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-difference {
  display: flex;
  gap: .35rem;
}
</style>
