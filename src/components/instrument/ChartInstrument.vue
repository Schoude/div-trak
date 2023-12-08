<script setup lang="ts">
import type { AggregateHistoryEvent } from '@/types/tr/events/aggregate-history';
import { defaultFormat, timeformat } from '@/utils/visus';
import { axisBottom, axisLeft, format, max, min, scaleBand, scaleLinear, scaleLog, schemeSet1, select, utcFormat, utcMinutes } from 'd3';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  ticker: AggregateHistoryEvent;
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {
  top: 16,
  right: 0,
  bottom: 24,
  left: 50,
};
const width = 1200 - margin.left - margin.right;
const height = 360 - margin.top - margin.bottom;

function drawChart () {
  const svgEl = chart.value?.querySelector('svg');

  if (svgEl) {
    svgEl.remove();
  }

  const svg = select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Y-Axis
  const y = scaleLog()
    // @ts-expect-error bad lib types
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
  // Minutes in 10 minute interval
  const xDomain = utcMinutes(
    new Date(props.ticker.aggregates.at(0)!.time),
    new Date(props.ticker.expectedClosingTime),
    props.ticker.resolution / 1000 / 60,
  );
  const x = scaleBand()
    // @ts-expect-error bad lib types
    .domain(xDomain)
    .range([0, width])
    .padding(0.45);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    // @ts-expect-error bad lib types
    .call(axisBottom(x).tickFormat(timeformat.format('%H:%M')))
    .call(g => g.select('.domain').remove());

  // Candles
  const g = svg.append('g')
    .attr('stroke-linecap', 'round')
    .attr('stroke', 'black')
    .selectAll('g')
    .enter()
    .data(props.ticker.aggregates)
    .join('g')
    // @ts-expect-error bad lib types
    .attr('transform', d => `translate(${x(d.time)},0)`);

  // Whiskers
  g.append('line')
    .attr('y1', d => y(+d.low))
    .attr('y2', d => y(+d.high))
    .attr('stroke', 'white');

  // Candle
  g.append('line')
    .attr('y1', d => y(+d.open))
    .attr('y2', d => y(+d.close))
    .attr('stroke-width', x.bandwidth())
    .attr('stroke', d => d.open > d.close ? schemeSet1[0]
      : d.close > d.open ? schemeSet1[2]
        : schemeSet1[8]);

  // Information
  const formatDate = utcFormat('%B %-d, %Y');
  const formatValue = defaultFormat.format('$.2f');

  g.append('title')
    .text(d => `${formatDate(new Date(d.time))}
Open: ${formatValue(+d.open)}
Close: ${formatValue(+d.close)} (${format('+.2%')(1 - (+d.open / +d.close))})
Low: ${formatValue(+d.low)}
High: ${formatValue(+d.high)}`);
}

onMounted(() => {
  drawChart();
});

watch(() => props.ticker, () => {
  drawChart();
});
</script>

<template>
  <div class="chart-instrument">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<style scoped lang="scss">
.chart {
  &:deep(svg) {
    .tick {
      text {
        font-size: 13px;
        font-family: var(--font-family);
      }
    }

  }
}
</style>
