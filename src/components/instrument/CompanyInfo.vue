<script setup lang="ts">
import type { Tag } from '@/types/tr/events/instruments';
import type { Company } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import TagText from '../display/TagText.vue';

defineProps<{
  company: Company;
  tags: Tag[];
}>();
</script>

<template>
  <div class="company-info text-s">
    <h2 class="text-m">Indicators</h2>
    <div class="grid">
      <div class="indicators">
        <span v-if="company?.dividendYieldSnapshot" class="indicator">Yield: {{ formatNumber(company.dividendYieldSnapshot
          *
          100, { style: 'decimal', roundingMode: 'floor' }) }}
          %</span>
        <span v-if="company?.beta" class="indicator">Beta: {{ formatNumber(company.beta, {
          style: 'decimal', roundingMode:
            'floor'
        }) }}</span>
        <span v-if="company?.eps" class="indicator">EPS: {{ formatNumber(company.eps, {
          style: 'currency', currency: 'USD'
        })
        }}</span>
        <span v-if="company?.peRatioSnapshot" class="indicator">Price-to-Earnings: {{
          formatNumber(company.peRatioSnapshot,
            { style: 'decimal', roundingMode: 'floor' }) }}</span>
        <span v-if="company?.pbRatioSnapshot" class="indicator">Price-to-Book: {{ formatNumber(company.pbRatioSnapshot *
          100,
          { style: 'decimal', roundingMode: 'floor' }) }} %</span>
      </div>
    </div>

    <h2 class="text-m">Description</h2>
    <div class="description">
      <div class="tags">
        <TagText v-for="(tag, index) of tags" :key="index">
          <div class="inner">
            <img :class="{ inverted: tag.type !== 'country' }" :src="tag.icon" :alt="tag.name">
            <span>{{ tag.name }}</span>
          </div>
        </TagText>
      </div>
      <p class="text">{{ company?.description }}</p>
    </div>

    <h2 class="text-m">Company & People</h2>
    <div class="people">
      <span v-if="company?.employeeCount">Employees: {{ company.employeeCount }}</span>
      <span v-if="company?.yearFounded">Founding Year: {{ company.yearFounded }}</span>
      <span v-if="company?.ceoName">CEO: {{ company.ceoName }}</span>
      <span v-if="company?.cfoName">CFO: {{ company.cfoName }}</span>
      <span v-if="company?.cooName">COO: {{ company.cooName }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.company-info {
  margin-block-start: 1.35rem;
}

h2 {
  margin-block-end: .35rem;
}

.indicators,
.people {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .35rem;
  margin-block-end: 1.35rem;
}

.indicators,
.description,
.people {
  margin-block-end: 1.35rem;
}

.grid {
  @media only screen and (width >=768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.tags {
  display: flex;
  gap: .35rem;
  flex-wrap: wrap;
  margin-block: .35rem;

  .inner {
    display: flex;
    align-items: center;
    gap: .35rem;

    img {
      inline-size: 0.75rem;

      &.inverted {
        filter: invert(1);
      }
    }
  }
}

.description {
  .text {
    block-size: 120px;
    overflow: auto;

    @media only screen and (width >=768px) {
      block-size: initial;
      max-inline-size: 120ch;
      text-align: justify;
      margin-inline: auto;
    }
  }
}
</style>
