<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import { onMounted } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[]
}>();

const margin = { top: 30, right: 30, bottom: 100, left: 60 };
const width = 360 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

onMounted(() => {
  setTimeout(() => {


    const svg = select('#my_dataviz')
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
      .attr('class', 'text-s')
      .style('text-anchor', 'end');

    // Add Y axis
    const maxValue = max(props.dividends.map(d => d.payment));

    const y = scaleLinear()
      .domain([0, maxValue!])
      .range([height, 0]);

    svg.append('g')
      .call(axisLeft(y));

    // Bars
    svg.selectAll('mybar')
      .data(props.dividends)
      .join('rect')
      .attr('x', d => x(d.instrumentName) as number)
      .attr('y', d => y(d.payment))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.payment))
      .attr('fill', '#69b3a2');

  }, 200);
});
</script>

<template>
  <div id="my_dataviz" class="dividends-of-month"></div>
</template>

<style scoped lang="scss">
.dividends-of-month {
  block-size: 300px;

  &:deep(g) {

    text {
      font-family: inherit;
    }
  }
}
</style>