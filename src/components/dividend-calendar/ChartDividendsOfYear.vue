<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { defaultFormat, monthIndicesMap, monthNamesMap } from '@/utils/visus';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, scaleOrdinal, select, stack } from 'd3';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[][];
}>();

const chart = ref<HTMLElement | null>(null);

const detailMonth = ref<number>(new Date().getUTCMonth());
const getDetailMonthDividends = computed(() => props.dividends.at(detailMonth.value)?.sort((a, b) => b.payment - a.payment));
const detailMonthAggregatedDividends = computed(() => formatNumber(getDetailMonthDividends.value?.reduce((acc, d) => {
  acc += d.payment;

  return acc;
}, 0) ?? 0, { style: 'currency', currency: 'EUR' }));

const margin = {
  top: 16,
  right: 0,
  bottom: 24,
  left: 60
};
const width = 1200 - margin.left - margin.right;
const height = 320 - margin.top - margin.bottom;

onMounted(() => {
  const tooltip = select(chart.value)
    .append('div')
    .attr('class', 'tooltip text-s');

  const mousemove = function (event: MouseEvent) {
    tooltip
      .style('transform', 'translate(5%, -120%)')
      .style('left', `${event.x}px`)
      .style('top', `${event.y}px`);
  };

  const mouseover = function (event: MouseEvent, d: { data: Record<string, number> }) {
    // @ts-expect-error bad lib types
    const name = (select(this.parentNode).datum() as { key: string }).key;
    const value = formatNumber(d.data[name], { currency: 'EUR', style: 'currency' });
    tooltip
      .html(`${name} • ${value}`)
      .style('opacity', 1);

    const rect = event.target as SVGRectElement;
    select(rect)
      .attr('class', 'hovered');
  };

  const mouseleave = function (event: MouseEvent) {
    tooltip
      .style('opacity', 0);

    const rect = event.target as SVGRectElement;
    select(rect)
      .attr('class', '');
  };

  const onBarClick = function (_e: MouseEvent, d: unknown) {
    const monthIndex = monthIndicesMap.get((d as { data: { group: string } }).data.group);
    detailMonth.value = monthIndex!;
  };

  // START data setup
  const subgroups = new Set();
  const data = props
    .dividends
    .map((dividendsOfMonth, index) => {
      const dataPoint: Record<string, string | number> = {
        group: monthNamesMap.get(index)!
      };

      dividendsOfMonth.forEach(dividend => {
        subgroups.add(dividend.instrumentName);
        dataPoint[dividend.instrumentName] = dividend.payment;
      });

      return dataPoint;
    });

  const groups = props.dividends.map((_, index) => monthNamesMap.get(index)!);
  const aggrgateDividendsInMonth = props.dividends.map(dividend => dividend.reduce((acc, dividend) => {
    acc += dividend.payment;

    return acc;
  }, 0));
  // END data setup

  const svg = select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Add X axis (bottom)
  const xBottom = scaleBand()
    .domain(groups)
    .range([0, width])
    .padding(0.1);
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(xBottom).tickSizeOuter(0))
    .attr('class', 'axis-x');

  // Add Y axis
  const maxValue = max(aggrgateDividendsInMonth)!;

  const y = scaleLinear()
    .domain([0, maxValue!])
    .range([height, 0]);

  const axisY = axisLeft(y)
    .tickFormat(defaultFormat.format('$.2f'))
    .ticks(4);

  svg.append('g')
    .call(axisY)
    .attr('class', 'axis-y');

  // Add subgroups
  const color = scaleOrdinal()
    // @ts-expect-error bad lib types
    .domain([...subgroups.values()])
    .range([
      // purple to pink
      'hsl(281, 87%, 29%, .6)',
      'hsl(329, 91%, 41%, .6)',
      'hsl(333, 87%, 52%, .6)',
      'hsl(335, 98%, 57%, .6)',
      // orange to yellow
      'hsl(17, 96%, 64%, .6)',
      'hsl(29, 98%, 63%, .6)',
      'hsl(10, 96%, 62%, .6)',
      'hsl(38, 98%, 63%, .6)',
    ]);

  const stackedData = stack()
    // @ts-expect-error bad lib types
    .keys([...subgroups.values()])(data);

  svg.append('g')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', (d) => {
      return color((d as unknown as { key: string }).key) as string;
    })
    .selectAll('rect')
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => {
      return xBottom(((d as unknown as { data: { group: string } }).data).group) as unknown as string;
    })
    .attr('y', function (d) {
      return y(d[1] as unknown as number);
    })
    .attr('height', function (d) {
      return !Number.isNaN(d[1]) ? y(d[0] as unknown as number) - y(d[1] as unknown as number) : 0;
    })
    .attr('width', xBottom.bandwidth())
    .attr('stroke', '#ffffff99')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
    .on('click', onBarClick);
});
</script>

<template>
  <div class="chart-dividends-of-year">
    <div class="wrapper">
      <h2>Dividend Calendar</h2>
      <div ref="chart" class="dividends-yearly"></div>
    </div>

    <div class="month-details">
      <h2 class="heading">Month Details ({{ monthNamesMap.get(detailMonth) }})</h2>
      <div class="dividends-aggretated">Aggregated Dividends: {{ detailMonthAggregatedDividends }}</div>
      <ul class="dividends-list">
        <li class="dividend" :class="{ forecast: dividend.hasForecast }" v-for="dividend of getDetailMonthDividends"
          :key="dividend.id" :title="dividend.hasForecast ? 'Includes forecast orders' : ''">
          <RouterLink class="name" :to="{ name: 'instrument', params: { isin: dividend.isin } }">{{
            dividend.instrumentName }}
          </RouterLink>
          <div class="metadata">
            <span class="payment"><b>{{ dividend.paymentFormatted }}</b> • </span>
            <span class="date text-s">@ {{ new Date(dividend.paymentDate).toLocaleDateString() }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dividends-yearly {
  min-block-size: 335px;
  overflow-x: auto;
  inline-size: 100%;
  position: relative;

  &:deep(.tooltip) {
    opacity: 0;
    position: fixed;
    white-space: nowrap;
    background-color: #0a080b;
    border: 1px solid rgb(48, 48, 48);
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    box-shadow: var(--shadow);
    transition: opacity .25s ease-out;
    pointer-events: none;
  }

  &:deep(svg) {
    max-width: initial;

    .axis-y,
    .axis-x {
      text {
        font-size: 13px;
      }
    }

    .tick {
      text {
        font-family: var(--font-family);
      }
    }

    rect {
      cursor: pointer;
      transition: fill .25s ease-out;

      &.hovered {
        fill: #3d4a5b;
      }
    }
  }
}

.month-details {
  min-inline-size: 400px;
  margin-block-start: 1.5rem;

  .heading {
    margin-block-end: .2rem;
  }

  .dividends-aggretated {
    margin-block-end: .75rem;
  }
}

.dividends-list {
  padding: 0;
  list-style: none;
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
  block-size: max-content;

  .dividend {
    block-size: max-content;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid var(--color-accent-1);
    padding: 0.35rem .75rem;
    line-height: 1;
    border-radius: 8px;

    .name {
      &:hover {
        text-decoration: underline;
      }
    }

    .metadata {
      margin-block-start: .25rem;
    }

    &.forecast {
      position: relative;
      padding-inline-start: 1.2rem;

      &::after {
        position: absolute;
        top: 8px;
        left: 6px;
        content: "";
        width: 8px;
        height: 8px;
        background-color: rgb(253, 185, 68);
        border-radius: 50%;
      }
    }
  }
}
</style>
