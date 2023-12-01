<script setup lang="ts">
import { formatLocale } from 'd3';
import { ref } from 'vue';

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
</script>

<template>
  <div class="chart-dividends-of-year">
    <div ref="chart" class="dividends-yearly"></div>
  </div>
</template>

<style lang="scss" scoped>
.dividends-yearly {
  inline-size: 250px;
  block-size: 150px;
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