<script setup lang="ts">
import { useAggretatesStore } from '@/stores/aggregates';
import type { AggregateHistoryEvent, RangeHistory, Ticker } from '@/types/tr/events/aggregate-history';
import type { TickerEvent } from '@/types/tr/events/ticker';
import { defaultFormat, timeformat } from '@/utils/visus';
import {
axisBottom,
axisLeft,
format,
max,
min,
scaleBand,
scaleLinear,
scaleLog,
scaleTime,
schemeSet1,
select,
utcDays,
utcHours,
utcMinutes,
} from 'd3';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  ticker: TickerEvent;
  history: AggregateHistoryEvent;
}>();

const aggregatesStore = useAggretatesStore();

const chart = ref<HTMLElement | null>(null);

const margin = {
  top: 5,
  right: 20,
  bottom: 32,
  left: 65,
};
const width = 1200 - margin.left - margin.right;
const height = 360 - margin.top - margin.bottom;

const formatDate = timeformat.format('%H:%M %B %-d, %Y');
const formatValue = defaultFormat.format('$.2f');

const getXDomainBandScale = computed(() => {
  let xDomain = [];

  switch (aggregatesStore.range) {
    case '1d': {
      xDomain = utcMinutes(
        new Date(props.history.aggregates.at(0)!.time),
        new Date(props.history.expectedClosingTime),
        props.history.resolution / 1000 / 60,
      );

      break;
    }

    case '5d':
    case '1m': {
      xDomain = utcHours(new Date(props.history.aggregates.at(0)!.time),
        new Date(props.history.expectedClosingTime),
        props.history.resolution / 1000 / 60 / 60);

      break;
    }

    case '6m':
    case '1y':
    case 'max': {
      xDomain = utcDays(new Date(props.history.aggregates.at(0)!.time),
        new Date(props.history.expectedClosingTime),
        props.history.resolution / 1000 / 60 / 60 / 24);
      break;
    }
  }

  return xDomain;
});

const xTime = computed(() => {
  return scaleTime([
    new Date(props.history.aggregates.at(0)!.time),
    new Date(props.history.expectedClosingTime)],
    [0, width],
  )
    .nice();
});

function drawChart () {
  const svgEl = chart.value?.querySelector('svg');

  if (svgEl) {
    svgEl.remove();
  }

  const tooltipEl = chart.value?.querySelector('.tooltip');

  if (tooltipEl) {
    tooltipEl.remove();
  }

  const tooltip = select(chart.value)
    .append('div')
    .attr('class', 'tooltip text-s');

  const mousemove = function (event: MouseEvent) {
    tooltip
      .style('transform', 'translate(3%, -105%)')
      .style('left', `${event.x}px`)
      .style('top', `${event.y}px`);
  };

  const mouseover = function (event: MouseEvent, d: Ticker) {
    const value = `${formatDate(new Date(d.time))}\nOpen: ${formatValue(+d.open)}\nClose: ${formatValue(+d.close)} (${format('+.2%')(1 - (+d.open / +d.close))})\nLow: ${formatValue(+d.low)}\nHigh: ${formatValue(+d.high)}`;
    tooltip
      .html(value)
      .style('opacity', 1);

    const candleLine = event.target as SVGLineElement;
    select(candleLine)
      .attr('class', 'candle hovered');
  };

  const mouseleave = function (event: MouseEvent) {
    tooltip
      .style('opacity', 0);

    const candleLine = event.target as SVGLineElement;
    select(candleLine)
      .attr('class', 'candle');
  };

  const svg = select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 10)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Y-Axis
  const y = scaleLog()
    // @ts-expect-error bad lib types
    .domain([
      min(props.history.aggregates, d => +d.low),
      max(props.history.aggregates, d => +d.high),
    ])
    .rangeRound([height, margin.top]);

  svg.append('g')
    .call(axisLeft(y)
      .tickFormat(defaultFormat.format('$.2f'))
      .tickValues(
        scaleLinear()
          .domain(y.domain())
          .ticks(5),
      ))
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.2)
      .attr('x2', width))
    .call(g => g.select('.domain').remove());

  // X-Axis for candles
  const xBand = scaleBand()
    // @ts-expect-error bad lib types
    .domain(getXDomainBandScale.value)
    .range([0, width])
    .padding(0.45);

  svg.append('g')
    .call(axisBottom(xBand))
    .call(g => g.selectAll('.tick').remove())
    .call(g => g.select('.domain').remove());

  // X-Axis for time labels
  svg.append('g')
    .attr('transform', `translate(0,${height + 10})`)
    .attr('class', 'axis-time')
    .call(axisBottom(xTime.value))
    .call(g => g.select('.domain').remove());

  // Candles
  const g = svg.append('g')
    .attr('stroke-linecap', 'round')
    .attr('stroke', 'black')
    .selectAll('g')
    .enter()
    .data(props.history.aggregates)
    .join('g')
    // @ts-expect-error bad lib types
    .attr('transform', d => `translate(${xBand(d.time)},0)`);

  // Whiskers
  g.append('line')
    .attr('class', 'whisker')
    .attr('y1', d => y(+d.low))
    .attr('y2', d => y(+d.high))
    .attr('stroke', 'white');

  // Candle
  g.append('line')
    .attr('class', 'candle')
    .attr('y1', d => y(+d.open))
    .attr('y2', d => y(+d.close))
    .attr('stroke-width', xBand.bandwidth())
    .attr('stroke', d => d.open > d.close ? schemeSet1[0]
      : d.close > d.open ? schemeSet1[2]
        : schemeSet1[8])
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);
}

function onSetRangeClick (newRange: RangeHistory) {
  // @ts-expect-error bad dom api
  document.startViewTransition(async () => {
    aggregatesStore.setRange(newRange);
    await nextTick();
  });
}

onMounted(() => {
  drawChart();
});

watch(() => props.history, () => {
  drawChart();
});

watch(() => props.ticker, () => {
  drawChart();
});
</script>

<template>
  <div class="chart-instrument">
    <div class="action-ranges">
      <button class="button-range-select" :class="{ active: aggregatesStore.range === '1d' }" type="button"
        @click="onSetRangeClick('1d')">1D</button>
      <button class="button-range-select" :class="{ active: aggregatesStore.range === '5d' }" type="button"
        @click="onSetRangeClick('5d')">1W</button>
      <button class="button-range-select" :class="{ active: aggregatesStore.range === '1m' }" type="button"
        @click="onSetRangeClick('1m')">1M</button>
      <button class="button-range-select" :class="{ active: aggregatesStore.range === '6m' }" type="button"
        @click="onSetRangeClick('6m')">6M</button>
      <button class="button-range-select" :class="{ active: aggregatesStore.range === '1y' }" type="button"
        @click="onSetRangeClick('1y')">1Y</button>
      <button class="button-range-select" :class="{ active: aggregatesStore.range === 'max' }" type="button"
        @click="onSetRangeClick('max')">MAX</button>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<style scoped lang="scss">
.chart-instrument {
  margin-block-start: 1rem;

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
    white-space: pre-wrap;
  }
}

.action-ranges {
  display: flex;
  gap: 1rem;
  margin-block-end: 1rem;
}

.button-range-select {
  padding: .25rem;
  line-height: 1;
  transition: background-color .25s ease-out;
  border-radius: 8px;

  &.active,
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.chart {
  inline-size: 100%;
  overflow-x: auto;

  &:deep(svg) {
    max-inline-size: initial;
    margin-inline: auto;

    .tick {
      text {
        font-size: 13px;
        font-family: var(--font-family);
      }
    }

    .candle {
      transition: stroke .25s ease-out;

      &.hovered {
        stroke: #3d4a5b;
      }
    }
  }
}
</style>
