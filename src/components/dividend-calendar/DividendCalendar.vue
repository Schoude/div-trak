<script setup lang="ts">
import { useDividendsScrapedStore } from '@/stores/dividends-scraped';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import type { CalendarDividend, Dividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed, nextTick, ref } from 'vue';
import ButtonAction from '../buttons/ButtonAction.vue';
import ChartDividendsOfYear from './ChartDividendsOfYear.vue';

const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();
const dividendsScrapedStore = useDividendsScrapedStore();

const year = ref(new Date().getUTCFullYear());
const nextYear = computed(() => year.value + 1);
const selectedYear = ref(year.value);

function onYearSelectClick (year: number) {
  // @ts-expect-error krigt amal eure DOM API types auf die kedde
  document.startViewTransition(async () => {
    selectedYear.value = year;
    await nextTick();
  });
}

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
          .filter(dividend => dividend.paymentDate.includes(`${selectedYear.value}-${month.toString().padStart(2, '0')}`));

        const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
          .orders
          .filter((order) => {
            let keep = false;

            // Keep Orders of past years
            if (order.isin === instrument.instrument?.isin &&
              order.year < selectedYear.value) {
              keep = true;
            }

            // Keep Orders from this year including the current month
            if (order.isin === instrument.instrument?.isin && order.year == selectedYear.value && order.month <= month) {
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
              isEstimation: false,
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
        const estimatedDividends = dividendsScrapedStore.getScrapedDividendsByISIN(instrument.instrument?.isin!);
        const dividendMap = new Map<string, Dividend>();

        // Add estimated dividends
        estimatedDividends.map(estimatedDividend => {
          dividendMap.set(estimatedDividend.isin_ex_date, {
            id: estimatedDividend.isin_ex_date,
            isin: estimatedDividend.isin,
            paymentDate: estimatedDividend.payment_date,
            recordDate: null,
            exDate: estimatedDividend.ex_date,
            amount: estimatedDividend.amount,
            information: estimatedDividend.information,
            type: estimatedDividend.type,
          });
        });

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
          .filter(dividend => dividend.paymentDate.includes(`${selectedYear.value}-${month.toString().padStart(2, '0')}`));

        const instrumentAmountAtCurrentMonth = portfolioStore.detailPortfolio!
          .orders
          .filter((order) => {
            let keep = false;

            // Keep Orders of past years
            if (order.isin === instrument.instrument?.isin &&
              order.year < selectedYear.value) {
              keep = true;
            }

            // Keep Orders from this year including the current month
            if (order.isin === instrument.instrument?.isin && order.year == selectedYear.value && order.month <= month) {
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
              isEstimation: dividend.information === 'estimation',
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
</script>

<template>
  <div class="dividend-calendar">
    <div class="year-selection">
      <ButtonAction class="button-year-select text-xs" variant="dawn" @click="onYearSelectClick(year)">
        This Year ({{ year }})
      </ButtonAction>
      <ButtonAction class="button-year-select text-xs" variant="dusk" @click="onYearSelectClick(nextYear)">
        Next Year ({{ nextYear }})
      </ButtonAction>
    </div>
    <ChartDividendsOfYear :year="selectedYear" :dividends="dividendsCalendarData" />
  </div>
</template>

<style lang="scss" scoped>
.dividend-calendar {
  margin-block-start: 1.125rem;
  margin-block-end: 2.125rem;
}

.year-selection {
  display: flex;
  gap: 1rem;
  margin-block-end: 1.125rem;
}

.button-year-select {
  block-size: 1.75rem;
  padding-inline: .75rem;
  inline-size: fit-content;
}
</style>
