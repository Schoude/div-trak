<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { axisBottom, axisLeft, formatLocale, max, scaleBand, scaleLinear, scaleOrdinal, select, stack } from 'd3';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[][];
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {
  top: 16,
  right: 0,
  bottom: 16,
  left: 60
};
const width = 1200 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const defaultFormat = formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['', ' €']
});

onMounted(() => {
  setTimeout(() => {
    const groups = props.dividends.map((_, index) => index.toString());
    const subgroups = props
      .dividends
      .map(month => month);
    // .flatMap(month => month.map(dividend => ({ name: dividend.instrumentName, payment: dividend.payment })));

    const svg = select(chart.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = scaleBand()
      .domain(groups)
      .range([0, width])
      .padding(0.2);
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const maxValue = max(props.dividends.flatMap(dividend => dividend.map(d => d.payment)));

    const y = scaleLinear()
      .domain([0, maxValue!])
      .range([height, 0]);

    const axisY = axisLeft(y)
      .tickFormat(defaultFormat.format('$.2f'))
      .ticks(3);

    svg.append('g')
      .call(axisY)
      .attr('class', 'axis-y');

    // Add subgroups
    const color = scaleOrdinal()
      .domain(subgroups)
      // Add colors until 10
      .range([
        '#C7EFCF',
        '#FE5F55',
        '#EEF5DB',
      ]);

    //stack the data? --> stack per subgroup
    const stackedData = stack()
      .keys(subgroups)(props.dividends);

    // console.log(stackedData);

    svg.append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key) as string;
      })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {

        return d;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {

        // TOOD: this should be the month index
        return x(d.data.group);
      })
      .attr('y', function (d) {
        return y(d[1]);
      })
      .attr('height', function (d) {
        // console.log(d);

        return y(d[0]) - y(d[1]);
      })
      .attr('width', x.bandwidth())
      .attr('stroke', 'grey');
  }, 800);
});
</script>

<template>
  <div class="chart-dividends-of-year">
    <div class="text-m">
      Dividend Calendar
    </div>
    <div ref="chart" class="dividends-yearly"></div>
  </div>
</template>

<style lang="scss" scoped>
.dividends-yearly {
  inline-size: 1200px;
  block-size: 300px;
  position: relative;

  &:deep(.tooltip) {
    opacity: 0;
    position: absolute;
    white-space: nowrap;
    background-color: #0a080b;
    border: 1px solid rgb(48, 48, 48);
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    box-shadow: var(--shadow);
    transition: opacity .25s ease-out;
  }

  &:deep(svg) {
    .axis-y {
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
      transition: fill .25s ease-out;

      &.hovered {
        fill: #3d4a5b;
      }
    }
  }
}
</style>