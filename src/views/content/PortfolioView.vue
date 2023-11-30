<script setup lang="ts">
import InstrumentListItem from '@/components/lists/InstrumentListItem.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { CalendarDividend, Dividend } from '@/types/tr/events/stock-details';
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

const year = 2023;
const portfolioValue = computed(() => portfolioStore.instruments.reduce((acc, instrument) => {
  acc += instrument.value;

  return acc;
}, 0));

const dividendsCalendarData = computed(() => {
  const monthsMap = new Map<number, unknown[]>([
    [1, []],
    [2, []],
    [3, []],
    [4, []],
    [5, []],
    [6, []],
    [7, []],
    [8, []],
    [9, []],
    [10, []],
    [11, []],
    [12, []],
  ]);

  for (let month = 1; month <= 12; month++) {
    const dividendsOfMonth = monthsMap.get(month);

    if (!dividendsOfMonth) {
      break;
    }

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

      const dividendsOfCurrentMonth = [...dividendMap.values()]
        .filter(dividend => dividend.paymentDate.includes(`${year}-${month.toString().padStart(2, '0')}`));

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

      if (dividendsOfCurrentMonth.length > 0) {
        const dividendsWihPayment = dividendsOfCurrentMonth.map(dividend => {
          let sourceTax: number | null = null;
          let payment = dividend.amount * instrumentAmountAtCurrentMonth;

          if (instrument.instrument!.company.countryOfOrigin === 'US') {
            sourceTax = payment * .15;
            payment = payment - sourceTax;
          }

          let formattedSourceTax = sourceTax != null
            ? formatNumber(sourceTax, { style: 'currency', currency: 'EUR' })
            : sourceTax;

          return {
            // Dividend Information
            id: dividend.id,
            paymentDate: dividend.paymentDate,
            recordDate: dividend.recordDate,
            exDate: dividend.exDate,
            amount: dividend.amount,
            amountFormatted: formatNumber(dividend.amount, { style: 'currency', currency: 'EUR' }),
            // Payments
            paymentDateTimestamp: new Date(dividend.paymentDate).getTime(),
            amountOwned: instrumentAmountAtCurrentMonth,
            sourceTax,
            sourceTaxFormatted: formattedSourceTax,
            payment,
            paymentFormatted: formatNumber(payment, { style: 'currency', currency: 'EUR' }),
            // Instrument
            isin: instrument.instrument?.isin,
            instrumentName: instrument.instrument?.shortName,
          } as CalendarDividend;
        });

        dividendsOfMonth.push(...dividendsWihPayment.sort((a, b) => a.paymentDateTimestamp - b.paymentDateTimestamp));

        monthsMap.set(month, dividendsOfMonth);
      }
    });
  }

  return ([...monthsMap.values()] as unknown as CalendarDividend[][]);
});

const getDividendsOfCurrentMonth = computed(() => {
  const currentMonth = new Date().getUTCMonth();
  const dividendsOfCurrentMonth = dividendsCalendarData.value[currentMonth];

  const aggregatedAmount = dividendsOfCurrentMonth.reduce((acc, dividend) => {
    acc += dividend.amount;

    return acc;
  }, 0);

  return {
    aggregatedAmount: formatNumber(aggregatedAmount, { style: 'currency', currency: 'EUR' }),
    dividends: dividendsOfCurrentMonth
  };
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
    <h1>{{ portfolioStore.detailPortfolio?.name }}</h1>

    <div class="current-month">
      <div class="aggregated text-m">Monthly dividends: {{ getDividendsOfCurrentMonth.aggregatedAmount }}</div>
      <div class="dividend" v-for="dividend of getDividendsOfCurrentMonth.dividends" :key="dividend.id">
        {{ dividend }}
      </div>
    </div>

    <!-- <div class="dividend-calendar">
      <div class="month" v-for="(monthlyDividends, index) of dividendsCalendarData" :key="index">
        {{ index + 1 }}
        <div class="dividend" v-for="dividend of monthlyDividends" :key="dividend.id">
          {{ dividend }}
        </div>
      </div>
    </div> -->

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
.month {
  background-color: darkblue;
  margin-block-end: 1rem;
}

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
