<script setup lang="ts">
import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { axisBottom, axisLeft, formatLocale, max, scaleBand, scaleLinear, select } from 'd3';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  dividends: CalendarDividend[]
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {
  top: 16,
  right: 0,
  bottom: 16,
  left: 60
};
const width = 250 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;

const defaultFormat = formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['', ' €']
});

onMounted(() => {
  const tooltip = select(chart.value)
    .append('div')
    .attr('class', 'tooltip text-s');

  const mouseover = function (event: MouseEvent, d: CalendarDividend) {
    tooltip
      .html(`${d.instrumentName} • ${d.paymentFormatted}`)
      .style('opacity', 1);

    const rect = event.target as SVGRectElement;
    select(rect)
      .attr('class', 'hovered');
  };

  const mousemove = function (event: MouseEvent) {
    tooltip
      .style('transform', 'translate(5%, -120%)')
      .style('left', `${event.x}px`)
      .style('top', `${event.y}px`);
  };

  const mouseleave = function (event: MouseEvent) {
    tooltip
      .style('opacity', 0);

    const rect = event.target as SVGRectElement;
    select(rect)
      .attr('class', '');
  };

  setTimeout(() => {
    const svg = select(chart.value)
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
      .call(axisBottom(x).tickSize(0).tickValues([]));

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
    const bars = svg.selectAll('mybar')
      .data(props.dividends)
      .join('rect')
      .attr('x', d => x(d.instrumentName) as number)
      .attr('y', d => y(d.payment))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.payment))
      .attr('fill', '#242b35');

    bars
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);
  }, 800);
});
</script>

<template>
  <div class="chart-dividends-of-month">
    <div ref="chart" class="dividends-monthly"></div>

    <ul class="dividends-list">
      <li class="dividend" v-for="dividend of dividends" :key="dividend.id">
        <div class="name">{{ dividend.instrumentName }}</div>
        <div class="metadata">
          <span class="payment"><b>{{ dividend.paymentFormatted }}</b> • </span>
          <span class="date text-s">@ {{ new Date(dividend.paymentDate).toLocaleDateString() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.chart-dividends-of-month {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}

.dividends-monthly {
  inline-size: 250px;
  block-size: 150px;

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

    .metadata {
      margin-block-start: .25rem;
    }
  }
}
</style>
