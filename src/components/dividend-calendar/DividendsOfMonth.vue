<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { axisBottom, axisLeft, formatLocale, max, scaleBand, scaleLinear, select } from 'd3';
import { onMounted } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[]
}>();

const margin = {
  top: 16,
  right: 0,
  bottom: 100,
  left: 60
};
const width = 200 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const defaultFormat = formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['', ' €']
});

onMounted(() => {
  setTimeout(() => {
    const svg = select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = scaleBand()
      .range([0, width])
      .domain(props.dividends.map(d => d.instrumentName))
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(20,0), rotate(-20)')
      .style('text-anchor', 'end');

    // Add Y axis
    const maxValue = max(props.dividends.map(d => d.payment));

    const y = scaleLinear()
      .domain([0, maxValue!])
      .range([height, 0]);

    const axisY = axisLeft(y)
      .tickFormat(defaultFormat.format('$.2f'))
      .ticks(3);

    svg.append('g')
      .call(axisY)
      .attr('class', 'axis-y');

    // Bars
    svg.selectAll('mybar')
      .data(props.dividends)
      .join('rect')
      .attr('x', d => x(d.instrumentName) as number)
      .attr('y', d => y(d.payment))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.payment))
      .attr('fill', '#242b35');
  }, 800);
});
</script>

<template>
  <div class="dividends-of-month">
    <div id="chart"></div>

    <ul class="dividends-list">
      <li class="dividend" v-for="dividend of dividends" :key="dividend.id">{{ dividend.instrumentName }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.dividends-of-month {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}

#chart {
  inline-size: 200px;
  block-size: 300px;

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
  }
}

.dividends-list {
  padding: 0;
  list-style: none;
}
</style>
