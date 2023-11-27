<script setup lang="ts">
import CompanyInfo from '@/components/instrument/CompanyInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { Stock } from '@/types/tr/instrument';
import AnalystRating from '../instrument/AnalystRating.vue';

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

    <AnalystRating :analyst-rating="stock.stockDetails.analystRating" :current-price="+ticker.bid.price" />
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
