<script setup lang="ts">
import AnalystRating from '@/components/instrument/AnalystRating.vue';
import CompanyInfo from '@/components/instrument/CompanyInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import EventsList from '@/components/lists/EventsList.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { Dividend, DividendWithPayment } from '@/types/tr/events/stock-details';
import type { TickerEvent } from '@/types/tr/events/ticker';
import { type Stock } from '@/types/tr/instrument';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';
import InstrumentPortfolioInfo from '../instrument/InstrumentPortfolioInfo.vue';
import DividendsList from '../lists/DividendsList.vue';

const props = defineProps<{
  stock: Stock;
  ticker: TickerEvent;
  isInDetailPortfolio: boolean;
}>();

const portfolioStore = usePortfolioStore();

const dividendYield = computed(() => `${formatNumber(props.stock.stockDetails.company.dividendYieldSnapshot * 100, { style: 'decimal', roundingMode: 'floor' })} %`);

const aggregatedDividends = computed(() => {
  const pastDividends = props.stock.stockDetails?.dividends;
  const eventDividends = props.stock.stockDetails?.events.filter(event => event.dividend);
  const dividendMap = new Map<string, Dividend>();

  // Add newer dividends first
  eventDividends
    ?.filter(event => event.dividend != null)
    .forEach(event => {
      if (event.dividend) {
        dividendMap.set(event.dividend.id, event.dividend);
      }
    });

  if (props.stock.stockDetails?.expectedDividend) {
    dividendMap.set(props.stock.stockDetails.expectedDividend.id, props.stock.stockDetails.expectedDividend);
  }

  // Then add already past dividends
  pastDividends?.forEach(dividend => dividendMap.set(dividend.id, dividend));

  // Sort newest to oldest
  return [...dividendMap.values()].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
});

const paymentMonths = computed(() => {
  const frequency = props.stock.stockDetails.dividendFrequency;

  const monthsWithPayments = new Set();

  aggregatedDividends.value.forEach(dividend => {
    const paymentDate = new Date(dividend.paymentDate);
    monthsWithPayments.add(paymentDate.getMonth() + 1);
  });

  return `${frequency ?? 'n. a.'} (${([...monthsWithPayments.values()] as number[]).sort((a, b) => a - b).join('|')})`;
});

const calculatedDividendPayments = computed<DividendWithPayment[]>(() => aggregatedDividends.value?.map(dividend => {
  const orders = portfolioStore.detailPortfolio?.orders;

  let orderAmountExDate = 0;
  let sourceTax: number | null = null;

  orders
    ?.filter(order => order.isin === props.stock.instrument.isin)
    .forEach(order => {
      if (new Date(order.executed_at).getTime() <= new Date(dividend.exDate).getTime()) {
        orderAmountExDate += order.amount;
      }
    });

  let paymentAmount = dividend.amount * orderAmountExDate;

  if (props.stock.instrument.company.countryOfOrigin === 'US' || props.stock.stockDetails?.company.countryCode === 'US') {
    sourceTax = paymentAmount * .15;
    paymentAmount = paymentAmount - sourceTax;
  }

  let formattedSourceTax = sourceTax != null
    ? formatNumber(sourceTax, { style: 'currency', currency: 'EUR' })
    : sourceTax;

  return {
    ...dividend,
    sourceTax: formattedSourceTax,
    amountAtExDate: orderAmountExDate,
    paymentAmount: formatNumber(paymentAmount, { style: 'currency', currency: 'EUR' }),
  };
}));
</script>

<template>
  <section class="stock-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="stock.instrument.imageId" />
    <h1 class="text-l">{{ stock.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <InstrumentPortfolioInfo :is-in-detail-portfolio="isInDetailPortfolio" :instrument="stock">
      <template #dividends v-if="calculatedDividendPayments.length > 0">
        <DividendsList :dividends="calculatedDividendPayments" :frequency="paymentMonths" :yield="dividendYield">
          <template #title>
            Dividends in Portfolio <small>({{ portfolioStore.detailPortfolio?.name }})</small>
          </template>
        </DividendsList>
      </template>
    </InstrumentPortfolioInfo>

    <!-- Only show if the instrument is NOT in the detail portfolio -->
    <DividendsList v-if="aggregatedDividends.length > 0 && !isInDetailPortfolio" :dividends="aggregatedDividends"
      :frequency="paymentMonths" :yield="dividendYield">
      <template #title>
        Dividends
      </template>
    </DividendsList>

    <AnalystRating :analyst-rating="stock.stockDetails?.analystRating" :current-price="+ticker.bid.price" />

    <EventsList :events="stock.stockDetails?.events" />

    <CompanyInfo :company="stock.stockDetails?.company" :tags="stock.instrument.tags" />
  </section>
</template>

<style lang="scss" scoped>
.image {
  margin-block-end: .5rem;
}
</style>
