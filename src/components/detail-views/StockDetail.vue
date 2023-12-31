<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import AnalystRating from '@/components/instrument/AnalystRating.vue';
import ChartInstrument from '@/components/instrument/ChartInstrument.vue';
import CompanyInfo from '@/components/instrument/CompanyInfo.vue';
import InstrumentPortfolioInfo from '@/components/instrument/InstrumentPortfolioInfo.vue';
import InstrumentPriceInfo from '@/components/instrument/InstrumentPriceInfo.vue';
import DividendsList from '@/components/lists/DividendsList.vue';
import EventsList from '@/components/lists/EventsList.vue';
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import ModalDividendHistory from '@/components/modals/ModalDividendHistory.vue';
import { useAggretatesStore } from '@/stores/aggregates';
import { useDividendsScrapedStore } from '@/stores/dividends-scraped';
import { useExchangeRatesStore } from '@/stores/exchange-rates';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { AggregateHistoryEvent } from '@/types/tr/events/aggregate-history';
import type { Dividend, DividendWithPayment } from '@/types/tr/events/stock-details';
import type { TickerEvent } from '@/types/tr/events/ticker';
import { type Stock } from '@/types/tr/instrument';
import { formatNumber } from '@/utils/intl/currency';
import { computed, ref } from 'vue';

const props = defineProps<{
  stock: Stock;
  ticker: TickerEvent;
  isInDetailPortfolio: boolean;
  history: AggregateHistoryEvent | null;
}>();

const modalIframe = ref<typeof ModalDividendHistory | null>(null);

const portfolioStore = usePortfolioStore();
const aggregateHistoryStore = useAggretatesStore();
const dividendsScrapedStore = useDividendsScrapedStore();
const exchangeRateStore = useExchangeRatesStore();

const isUSStock = computed(() => props.stock.instrument.company?.countryOfOrigin === 'US' || props.stock.stockDetails?.company?.countryCode === 'US');
const dividendYield = computed(() => `${formatNumber(props.stock.stockDetails?.company?.dividendYieldSnapshot * 100, { style: 'decimal', roundingMode: 'floor' })} %`);

const aggregatedDividends = computed(() => {
  const pastDividends = props.stock.stockDetails?.dividends;
  const eventDividends = props.stock.stockDetails?.events.filter(event => event.dividend);
  const estimatedDividends = dividendsScrapedStore.getScrapedDividendsByISIN(props.stock.instrument.isin);
  const dividendMap = new Map<string, Dividend>();

  // Add estimated dividends
  estimatedDividends.map(estimatedDividend => {
    const amountInEUR = estimatedDividend.amount * exchangeRateStore.exchangeRates.USD_EUR;

    dividendMap.set(estimatedDividend.isin_ex_date, {
      id: estimatedDividend.isin_ex_date,
      isin: estimatedDividend.isin,
      paymentDate: estimatedDividend.payment_date,
      recordDate: null,
      exDate: estimatedDividend.ex_date,
      amount: amountInEUR,
      information: estimatedDividend.information,
      type: estimatedDividend.type,
    });
  });

  // Add newer dividends
  eventDividends
    ?.filter(event => event.dividend != null)
    .forEach(event => {
      if (event.dividend) {
        dividendMap.set(event.dividend.id!, event.dividend);
      }
    });

  if (props.stock.stockDetails?.expectedDividend) {
    dividendMap.set(props.stock.stockDetails.expectedDividend.id!, props.stock.stockDetails.expectedDividend);
  }

  // Add already past dividends
  pastDividends?.forEach(dividend => dividendMap.set(dividend.id!, dividend));

  // Sort newest to oldest
  return [...dividendMap.values()].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
});

const paymentMonths = computed(() => {
  const frequency = props.stock.stockDetails?.dividendFrequency;

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

  if (isUSStock.value) {
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

function onOpenIframeModalClick () {
  modalIframe.value?.onOpenIframeModalOpen();
}
</script>

<template>
  <section class="stock-detail">
    <TRAssetLoader class="image" asset-type="image" :image-id="stock.instrument.imageId" />
    <h1 class="text-l">{{ stock.instrument.shortName }}</h1>

    <InstrumentPriceInfo :ticker="ticker" />

    <ChartInstrument v-if="aggregateHistoryStore.aggregateHistory" :history="aggregateHistoryStore.aggregateHistory"
      :ticker="ticker" />

    <template v-if="portfolioStore.detailPortfolio">
      <InstrumentPortfolioInfo :is-in-detail-portfolio="isInDetailPortfolio" :instrument="stock">
        <template #dividends v-if="calculatedDividendPayments.length > 0">
          <DividendsList :dividends="calculatedDividendPayments" :frequency="paymentMonths" :yield="dividendYield">
            <template #title>
              Dividends in Portfolio <small>({{ portfolioStore.detailPortfolio?.name }})</small>
            </template>

            <template #action-dividendhistory>
              <ButtonAction type="button" class="button-dividendhistory-modal" variant="dusk"
                @click="onOpenIframeModalClick">
                Compare with dividendhistory.org
              </ButtonAction>

              <ModalDividendHistory ref="modalIframe" :stock-name="stock.instrument.shortName"
                :isin="stock.instrument.isin" />

            </template>
          </DividendsList>
        </template>
      </InstrumentPortfolioInfo>
    </template>
    <p v-else class="reminder-select-portfolio text-l">Please, select a portfolio to place orders.</p>

    <!-- Only show if the instrument is NOT in the detail portfolio -->
    <DividendsList v-if="aggregatedDividends.length > 0 && !isInDetailPortfolio" :dividends="aggregatedDividends"
      :frequency="paymentMonths" :yield="dividendYield">
      <template #title>
        Dividends
      </template>
    </DividendsList>

    <AnalystRating v-if="stock.stockDetails?.analystRating" :analyst-rating="stock.stockDetails?.analystRating"
      :current-price="+ticker.bid.price" />

    <EventsList v-if="stock.stockDetails?.events" :events="stock.stockDetails.events" />

    <CompanyInfo v-if="stock.stockDetails?.company" :company="stock.stockDetails.company" :tags="stock.instrument.tags" />
  </section>
</template>

<style lang="scss" scoped>
.image {
  margin-block-end: .5rem;
}

.reminder-select-portfolio {
  margin-block: 0.5rem;
  text-align: center;
}

.button-dividendhistory-modal {
  block-size: 1.75rem;
  font-size: .7rem;
  inline-size: fit-content;
  padding-inline: .65rem;
}
</style>
