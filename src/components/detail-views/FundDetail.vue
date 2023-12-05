<script setup lang="ts">
import InstrumentPortfolioInfo from '@/components/instrument/InstrumentPortfolioInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { ETF } from '@/types/tr/instrument';

defineProps<{
  etf: ETF;
  ticker: TickerEvent;
  isInDetailPortfolio: boolean;
}>();
</script>

<template>
  <section class="fund-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="etf.instrument.imageId" />
    <h1 class="text-l">{{ etf.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <InstrumentPortfolioInfo :is-in-detail-portfolio="isInDetailPortfolio" :instrument="etf">
      <!-- <template #dividends v-if="calculatedDividendPayments.length > 0">
        <DividendsList :dividends="calculatedDividendPayments" :frequency="paymentMonths" :yield="dividendYield">
          <template #title>
            Dividends in Portfolio <small>({{ portfolioStore.detailPortfolio?.name }})</small>
          </template>
        </DividendsList>
      </template> -->
    </InstrumentPortfolioInfo>
  </section>
</template>
