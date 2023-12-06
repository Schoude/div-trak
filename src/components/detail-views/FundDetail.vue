<script setup lang="ts">
import InstrumentPortfolioInfo from '@/components/instrument/InstrumentPortfolioInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import DividendsList from '@/components/lists/DividendsList.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { DividendWithPayment } from '@/types/tr/events/stock-details';
import type { TickerEvent } from '@/types/tr/events/ticker';
import type { ETF } from '@/types/tr/instrument';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';

const props = defineProps<{
  etf: ETF;
  ticker: TickerEvent;
  isInDetailPortfolio: boolean;
}>();

const portfolioStore = usePortfolioStore();

const dividendYield = computed(() => `${formatNumber(((props.etf.etfDetails?.metrics?.yield ?? 0) * 100), { style: 'decimal', roundingMode: 'floor' })} %`);

const paymentMonths = computed(() => {
  const frequency = props.etf.etfDetails.distributionFrequency;

  const monthsWithPayments = new Set();

  props.etf.etfDetails.distributions.forEach(distribution => {
    const paymentDate = new Date(distribution.paymentDate);
    monthsWithPayments.add(paymentDate.getMonth() + 1);
  });

  return `${frequency ?? 'n. a.'} (${([...monthsWithPayments.values()] as number[]).sort((a, b) => a - b).join('|')})`;
});

const calculatedDividendPayments = computed<DividendWithPayment[]>(() => props.etf.etfDetails?.distributions?.map(distribution => {
  const orders = portfolioStore.detailPortfolio?.orders;

  let orderAmountExDate = 0;

  orders
    ?.filter(order => order.isin === props.etf.instrument.isin)
    .forEach(order => {
      if (new Date(order.executed_at).getTime() <= new Date(distribution.exDate).getTime()) {
        orderAmountExDate += order.amount;
      }
    });

  let paymentAmount = distribution.amount * orderAmountExDate;

  return {
    ...distribution,
    sourceTax: null,
    amountAtExDate: orderAmountExDate,
    paymentAmount: formatNumber(paymentAmount, { style: 'currency', currency: 'EUR' }),
  };
}));

</script>

<template>
  <section class="fund-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="etf.instrument.imageId" />
    <h1 class="text-l">{{ etf.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <InstrumentPortfolioInfo :is-in-detail-portfolio="isInDetailPortfolio" :instrument="etf">
      <template #dividends v-if="calculatedDividendPayments.length > 0">
        <DividendsList :dividends="calculatedDividendPayments" :frequency="paymentMonths" :yield="dividendYield">
          <template #title>
            Distributions in Portfolio <small>({{ portfolioStore.detailPortfolio?.name }})</small>
          </template>
        </DividendsList>
      </template>
    </InstrumentPortfolioInfo>
  </section>
</template>
