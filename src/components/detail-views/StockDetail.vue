<script setup lang="ts">
import AnalystRating from '@/components/instrument/AnalystRating.vue';
import CompanyInfo from '@/components/instrument/CompanyInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import EventsList from '@/components/lists/EventsList.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { Stock } from '@/types/tr/instrument';
import DividendsList from '../lists/DividendsList.vue';

defineProps<{
  stock: Stock;
  ticker: TickerEvent;
}>();
</script>

<template>
  <section class="stock-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="stock.instrument.imageId" />
    <h1 class="text-l">{{ stock.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <!-- OrderManager here -->

    <DividendsList :dividends="stock.stockDetails.dividends" />
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
