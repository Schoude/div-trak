<script setup lang="ts">
import type { TreemapStructure } from '@/types/tr/portfolio';
import { hierarchy, select, treemap, treemapSquarify } from 'd3';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  sectorData: TreemapStructure;
}>();

const chart = ref<HTMLElement | null>(null);
const margin = {
  top: 5,
  right: 0,
  bottom: 0,
  left: 0,
};
const width = 1200 - margin.left - margin.right;
const height = 160 - margin.top - margin.bottom;

function drawChart () {
  const svgEl = chart.value?.querySelector('svg');

  if (svgEl) {
    svgEl.remove();
  }

  const tooltipEl = chart.value?.querySelector('.tooltip');

  if (tooltipEl) {
    tooltipEl.remove();
  }

  const svg = select(chart.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 10)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const rootHierarchy = hierarchy(props.sectorData)
    .sum(d => {

      return d.count;
    })
    // @ts-expect-error bad lib types
    .sort((a, b) => b.count - a.count);

  const myTreemap = treemap()
    .tile(treemapSquarify)
    .size([width, height])
    .padding(1)
    .round(true);

  // @ts-expect-error bad lib types
  myTreemap(rootHierarchy);

  const childArray = rootHierarchy.descendants().filter(d => d.depth === 1);

  svg.selectAll('.cells')
    .data(childArray)
    .enter()
    .append('rect')
    // @ts-expect-error bad lib types
    .attr('x', d => d.x0)
    // @ts-expect-error bad lib types
    .attr('y', d => d.y0)
    // @ts-expect-error bad lib types
    .attr('width', d => d.x1 - d.x0)
    // @ts-expect-error bad lib types
    .attr('height', d => d.y1 - d.y0)
    .attr('stroke', 'var(--color-muted)')
    .attr('fill', 'hsl(345, 73%, 28%, .6)');

  // Texts
  svg.selectAll('text')
    .data(childArray)
    .enter()
    .append('text')
    // @ts-expect-error bad lib types
    .attr('x', d => d.x0 + (d.x1 - d.x0) / 2)
    // @ts-expect-error bad lib types
    .attr('y', d => d.y0 + (d.y1 - d.y0) / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(d => {
      return `${d.data.name} (${d.value})`;
    });
}

onMounted(() => {
  setTimeout(() => {
    drawChart();
  }, 200);
});

</script>

<template>
  <div class="chart-sectors-in-portfolio">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.chart-sectors-in-portfolio {
  margin-block-start: 1rem;
}

.chart {
  inline-size: 100%;
  overflow-x: auto;

  &:deep(svg) {
    max-inline-size: initial;

    text {
      font-size: 10px;
      font-family: var(--font-family);
    }
  }
}
</style>
