<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { axisBottom, axisLeft, formatLocale, max, scaleBand, scaleLinear, scaleOrdinal, select, stack } from 'd3';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[][];
}>();

const chart = ref<HTMLElement | null>(null);

const detailMonth = ref<number>(new Date().getUTCMonth());
const getDetailMonthDividends = computed(() => props.dividends.at(detailMonth.value));

const margin = {
  top: 16,
  right: 0,
  bottom: 24,
  left: 60
};
const width = 800 - margin.left - margin.right;
const height = 320 - margin.top - margin.bottom;

const defaultFormat = formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['', ' €']
});
const monthNamesMap = new Map([
  [0, 'Jan'],
  [1, 'Feb'],
  [2, 'Mar'],
  [3, 'Apr'],
  [4, 'May'],
  [5, 'Jun.'],
  [6, 'Jul'],
  [7, 'Aug'],
  [8, 'Sep'],
  [9, 'Oct'],
  [10, 'Nov'],
  [11, 'Dec'],
]);
const monthIndicesMap = new Map([
  ['Jan', 0],
  ['Feb', 1],
  ['Mar', 2],
  ['Apr', 3],
  ['May', 4],
  ['Jun.', 5],
  ['Jul', 6],
  ['Aug', 7],
  ['Sep', 8],
  ['Oct', 9],
  ['Nov', 10],
  ['Dec', 11],
]);

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

  setTimeout(() => {
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
        'hsl(219, 20%, 36%)',
        'hsl(219, 20%, 12%)',
        'hsl(219, 20%, 24%)',
        'hsl(219, 20%, 48%)',
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
      .attr('stroke', 'grey')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
      .on('click', onBarClick);
  }, 800);
});
</script>

<template>
  <div class="chart-dividends-of-year">
    <div class="wrapper">
      <h2>Dividend Calendar</h2>
      <div ref="chart" class="dividends-yearly"></div>
    </div>

    <div class="detail-month">
      <h2>Month Details</h2>
      <div class="details">
        <!-- <div class="fallback">
          No Month selected
        </div> -->
        {{ getDetailMonthDividends }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-dividends-of-year {
  display: flex;
  gap: 1rem;
}

.dividends-yearly {
  min-block-size: 335px;
  min-inline-size: 800px;
  position: relative;
  overflow-x: auto;

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
  }
}
</style>
