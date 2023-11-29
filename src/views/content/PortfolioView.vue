<script setup lang="ts">
import InstrumentListItem from '@/components/lists/InstrumentListItem.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

portfolioStore.selectPortfolio(+router.currentRoute.value.params.id);

if (!portfolioStore.detailPortfolio) {
  router.push({ name: 'dashboard' });
}

const portfolioValue = computed(() => portfolioStore.instruments.reduce((acc, instrument) => {
  acc += instrument.value;

  return acc;
}, 0));

const dividendsForYear = computed(() => {
  const year = 2023;
  // TODO: Or use const monthsMap = new Map<number, Map<string, unknown[]>>([
  const monthsMap = new Map<number, unknown[]>([
    [1, [{ month: 1 }]],
    [2, [{ month: 2 }]],
    [3, [{ month: 3 }]],
    [4, [{ month: 4 }]],
    [5, [{ month: 5 }]],
    [6, [{ month: 6 }]],
    [7, [{ month: 7 }]],
    [8, [{ month: 8 }]],
    [9, [{ month: 9 }]],
    [10, [{ month: 10 }]],
    [11, [{ month: 11 }]],
    [12, [{ month: 12 }]],
  ]);

  for (let month = 1; month < 12; month++) {
    const ordersOfMonth = monthsMap.get(month) as unknown[];

    instrumentStore.getInstruments.forEach(instrument => {
      // Get complete dividends of STOCK
      const pastDividends = instrument.stockDetails?.dividends;
      const eventDividends = instrument.stockDetails?.events.filter(event => event.dividend);
      const dividendMap = new Map<string, Dividend>();

      // Add newer dividends first
      eventDividends
        ?.filter(event => event.dividend != null)
        .forEach(event => {
          if (event.dividend) {
            dividendMap.set(event.dividend.id, event.dividend);
          }
        });

      if (instrument.stockDetails?.expectedDividend) {
        dividendMap.set(instrument.stockDetails.expectedDividend.id, instrument.stockDetails.expectedDividend);
      }

      // Then add already past dividends
      pastDividends?.forEach(dividend => dividendMap.set(dividend.id, dividend));
      const dividendsOfCurrentMonth = [...dividendMap.values()].filter(dividend => dividend.exDate.includes(`${year}-${month.toString().padStart(2, '0')}`));

      // TODO: Loop over all orders of the month and sum up the order amount for each dividend before the ex-date
      const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
        .orders
        .filter((order) =>
          order.isin === instrument.instrument?.isin &&
          order.year === year && order.month <= month
        )
        .reduce((acc, order) => {
          acc += order.amount;

          return acc;
        }, 0);

      // TODO: Either use a nested array as the map value or map for each instrument in each month
      if (instrumentAmountAtCurrentMonth > 0) {
        ordersOfMonth.splice(0, 1, {
          month,
          instrumentAmount: instrumentAmountAtCurrentMonth,
          dividends: dividendsOfCurrentMonth,
        });
      }
    });

  }

  return [...monthsMap.values()];
});

function getInstrumentsData () {
  portfolioStore.detailPortfolio?.isins.forEach(isin => {
    const existingInsrument = instrumentStore.getInstrument(isin);
    if (existingInsrument) {
      // Re-sub for existing ticker of the instrument
      socket.sendMessage(`sub ${existingInsrument.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

      return;
    }

    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"stockDetails","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
  });
}

onMounted(() => {
  getInstrumentsData();
});

onBeforeRouteLeave(() => {
  portfolioStore.instruments.forEach(instrumentData => {
    if (!instrumentData) {
      return;
    }

    socket.sendMessage(`unsub ${instrumentData.tickerEventId}`, { updateEventId: false });
  });
});
</script>

<template>
  <main class="portfolio-view view">

    <pre class="text-l">TODO: complete the dividend calendar aggretation</pre>

    <div>{{ dividendsForYear }}</div>

    <h1>{{ portfolioStore.detailPortfolio?.name }}</h1>
    <div class="portfolio-value text-m">{{ formatNumber(portfolioValue, { style: 'currency', currency: 'EUR' }) }}</div>

    <div class="instruments">
      <h2>Instruments</h2>
      <ul class="instruments-list" v-if="portfolioStore.instruments && portfolioStore.instruments?.length > 0">
        <InstrumentListItem :instrument="instrument" v-for="instrument of portfolioStore.instruments"
          :key="instrument?.instrument?.shortName" />
      </ul>
    </div>
  </main>
</template>

<style scoped lang="scss">
.instruments-list {
  padding: 0;
  padding-block-start: 1rem;
  display: grid;
  gap: 1rem;

  @media only screen and (width >=768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (width >=1280px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
