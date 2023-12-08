<script setup lang="ts">
import { defaultFormat, timeformat } from '@/utils/visus';
import { axisBottom, axisLeft, max, min, scaleLinear, scaleLog, scaleUtc, select } from 'd3';
import { onMounted, ref } from 'vue';
import type { AggregateHistory } from './aggregateHistory';

const props = defineProps<{
  ticker: AggregateHistory;
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {
  top: 16,
  right: 30,
  bottom: 24,
  left: 50,
};
const width = 1200 - margin.left - margin.right;
const height = 280 - margin.top - margin.bottom;

function drawChart () {
  const svg = select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Y-Axis
  const y = scaleLog()
    // @ts-expect-error bad libtypes
    .domain([
      min(props.ticker.aggregates, d => +d.low),
      max(props.ticker.aggregates, d => +d.high),
    ])
    .rangeRound([height, margin.top]);

  svg.append('g')
    .call(axisLeft(y)
      .tickFormat(defaultFormat.format('$.2f'))
      .tickValues(scaleLinear().domain(y.domain()).ticks()))
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.2)
      .attr('x2', width))
    .call(g => g.select('.domain').remove());

  // X-Axis
  const x = scaleUtc()
    .range([0, width])
    .domain([
      new Date(props.ticker.aggregates.at(0)!.time),
      new Date(props.ticker.expectedClosingTime),
    ]);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    // @ts-expect-error bad lib types
    .call(axisBottom(x).tickFormat(timeformat.format('%H:%M')))
    .call(g => g.select('.domain').remove());
}

onMounted(() => {
  drawChart();
});
</script>

<template>
  <div class="chart-instrument">
    <div ref="chart" class="chart"></div>
  </div>
</template>