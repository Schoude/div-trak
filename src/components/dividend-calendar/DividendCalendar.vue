<script setup lang="ts">
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { CalendarDividend, Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed, ref } from 'vue';

const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

const year = ref(2023);

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
        .filter(dividend => dividend.paymentDate.includes(`${year.value}-${month.toString().padStart(2, '0')}`));

      const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
        .orders
        .filter((order) =>
          order.isin === instrument.instrument?.isin &&
          order.year === year.value && order.month <= month
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
</script>

<template>
  <div class="dividend-calendar">
    <div class="current-month">
      <div class="aggregated text-m">Monthly payment: {{ getDividendsOfCurrentMonth.aggregatedAmount }}</div>
      <div class="dividend" v-for="dividend of getDividendsOfCurrentMonth.dividends" :key="dividend.id">
        {{ dividend }}
      </div>
    </div>

    <hr>

    <div class="month-list">
      <div class="month" v-for="(monthlyDividends, index) of dividendsCalendarData" :key="index">
        <div class="dividend" v-for="dividend of monthlyDividends" :key="dividend.id">
          {{ dividend }}
        </div>
      </div>
    </div>
  </div>
</template>