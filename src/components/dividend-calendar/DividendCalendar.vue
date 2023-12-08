<script setup lang="ts">
import ChartDividendsOfMonth from '@/components/dividend-calendar/ChartDividendsOfMonth.vue';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { CalendarDividend, Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed, ref } from 'vue';
import ChartDividendsOfYear from './ChartDividendsOfYear.vue';

const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

const year = ref(2023);

const dividendsCalendarData = computed(() => {
  const monthsMap = new Map<number, CalendarDividend[]>([
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
      // ETF distributions
      if (instrument.etfDetails) {
        const distributionsOfCurrentMonth = instrument
          .etfDetails
          .distributions
          .filter(dividend => dividend.paymentDate.includes(`${year.value}-${month.toString().padStart(2, '0')}`));

        const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
          .orders
          .filter((order) => {
            let keep = false;

            // Keep Orders of past years
            if (order.isin === instrument.instrument?.isin &&
              order.year < year.value) {
              keep = true;
            }

            // Keep Orders from this year including the current month
            if (order.isin === instrument.instrument?.isin && order.year == year.value && order.month <= month) {
              keep = true;
            }

            return keep;
          })
          .reduce((acc, order) => {
            acc.amount += order.amount;
            acc.hasForecast = order.execution_type === 'forecast';

            return acc;
          }, { amount: 0, hasForecast: false });

        if (distributionsOfCurrentMonth.length > 0 && instrumentAmountAtCurrentMonth.amount > 0) {
          const distributionsWithPayment = distributionsOfCurrentMonth.map(distribution => {
            const payment = distribution.amount * instrumentAmountAtCurrentMonth.amount;

            return {
              // Dividend Information
              id: crypto.randomUUID(),
              paymentDate: distribution.paymentDate,
              recordDate: distribution.recordDate,
              exDate: distribution.exDate,
              amount: distribution.amount,
              amountFormatted: formatNumber(distribution.amount, { style: 'currency', currency: 'EUR' }),
              // Payments
              paymentDateTimestamp: new Date(distribution.paymentDate).getTime(),
              amountOwned: instrumentAmountAtCurrentMonth.amount,
              hasForecast: instrumentAmountAtCurrentMonth.hasForecast,
              sourceTax: null,
              sourceTaxFormatted: '',
              payment,
              paymentFormatted: formatNumber(payment, { style: 'currency', currency: 'EUR' }),
              // Instrument
              isin: instrument.instrument?.isin,
              instrumentName: instrument.instrument?.shortName,
            } as CalendarDividend;
          });

          dividendsOfMonth.push(...distributionsWithPayment.sort((a, b) => a.paymentDateTimestamp - b.paymentDateTimestamp));

          monthsMap.set(month, dividendsOfMonth);
        }

        return;
      }

      // Stock dividends
      if (instrument.stockDetails) {
        // Get complete dividends of STOCK
        const pastDividends = instrument.stockDetails?.dividends;
        const eventDividends = instrument.stockDetails?.events.filter(event => event.dividend);
        const dividendMap = new Map<string, Dividend>();

        // Add newer dividends first
        eventDividends
          ?.filter(event => event.dividend != null)
          .forEach(event => {
            if (event.dividend) {
              dividendMap.set(event.dividend.id!, event.dividend);
            }
          });

        if (instrument.stockDetails?.expectedDividend) {
          dividendMap.set(instrument.stockDetails.expectedDividend.id!, instrument.stockDetails.expectedDividend);
        }

        // Then add already past dividends
        pastDividends?.forEach(dividend => dividendMap.set(dividend.id!, dividend));

        const dividendsOfCurrentMonth = [...dividendMap.values()]
          .filter(dividend => dividend.paymentDate.includes(`${year.value}-${month.toString().padStart(2, '0')}`));

        const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
          .orders
          .filter((order) => {
            let keep = false;

            // Keep Orders of past years
            if (order.isin === instrument.instrument?.isin &&
              order.year < year.value) {
              keep = true;
            }

            // Keep Orders from this year including the current month
            if (order.isin === instrument.instrument?.isin && order.year == year.value && order.month <= month) {
              keep = true;
            }

            return keep;
          })
          .reduce((acc, order) => {
            acc.amount += order.amount;
            acc.hasForecast = order.execution_type === 'forecast';

            return acc;
          }, { amount: 0, hasForecast: false });

        if (dividendsOfCurrentMonth.length > 0 && instrumentAmountAtCurrentMonth.amount > 0) {
          const dividendsWihPayment = dividendsOfCurrentMonth.map(dividend => {
            let sourceTax: number | null = null;
            let payment = dividend.amount * instrumentAmountAtCurrentMonth.amount;

            if (instrument.instrument?.company.countryOfOrigin === 'US' || instrument.stockDetails?.company.countryCode === 'US') {
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
              amountOwned: instrumentAmountAtCurrentMonth.amount,
              hasForecast: instrumentAmountAtCurrentMonth.hasForecast,
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
      }
    });
  }

  return [...monthsMap.values()];
});

const getDividendsOfCurrentMonth = computed(() => {
  const currentMonth = new Date().getUTCMonth();
  const dividendsOfCurrentMonth = dividendsCalendarData.value[currentMonth]!.sort((a, b) => b.payment - a.payment);

  const aggregatedAmount = dividendsOfCurrentMonth.reduce((acc, dividend) => {
    acc += dividend.payment;

    return acc;
  }, 0);

  return {
    aggregatedAmount: formatNumber(aggregatedAmount, { style: 'currency', currency: 'EUR' }),
    dividends: dividendsOfCurrentMonth,
  };
});
</script>

<template>
  <div class="dividend-calendar">
    <div class="current-month">
      <h2 class="aggregated-amount">Payment this month: {{ getDividendsOfCurrentMonth.aggregatedAmount }}</h2>

      <ChartDividendsOfMonth :dividends="getDividendsOfCurrentMonth.dividends" />
    </div>

    <ChartDividendsOfYear :dividends="dividendsCalendarData" />
  </div>
</template>

<style lang="scss" scoped>
.dividend-calendar {
  margin-block-start: 1.125rem;
  margin-block-end: 2.125rem;
}

.aggregated-amount {
  margin-block-end: 1rem;
}

.current-month {
  margin-block-end: 2.125rem;
}
</style>
