<script setup lang="ts">
import type { Tag } from '@/types/tr/events/instruments';
import type { Company } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';

defineProps<{
  company: Company;
  tags: Tag[];
}>();
</script>

<template>
  <div class="company-info">
    <h2 class="text-m">Indicators</h2>
    <div class="indicators">
      <span v-if="company.dividendYieldSnapshot" class="indicator">Yield: {{ company.dividendYieldSnapshot * 100 }}
        %</span>
      <span v-if="company.beta" class="indicator">Beta: {{ company.beta }}</span>
      <span v-if="company.eps" class="indicator">EPS: {{ formatNumber(company.eps, { style: 'currency', currency: 'USD' })
      }}</span>
      <span v-if="company.peRatioSnapshot" class="indicator">Price-to-Earnings: {{ company.peRatioSnapshot }}</span>
      <span v-if="company.pbRatioSnapshot" class="indicator">Price-to-Book: {{ company.pbRatioSnapshot * 100 }} %</span>
    </div>

  <h2 class="text-m">Description</h2>
    <div class="description">
      <div class="tags">
        <span class="tag text-xs" v-for="(tag, index) of tags" :key="index">{{ tag.name }}</span>
      </div>
      <p class="text">{{ company.description }}</p>
    </div>

    <h2 class="text-m">Company & People</h2>
    <div class="people">
      <span v-if="company.employeeCount">Employees: {{ company.employeeCount }}</span>
      <span v-if="company.yearFounded">Founding Year: {{ company.yearFounded }}</span>
      <span v-if="company.ceoName">CEO: {{ company.ceoName }}</span>
      <span v-if="company.cfoName">CFO: {{ company.cfoName }}</span>
      <span v-if="company.cooName">COO: {{ company.cooName }}</span>
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

.tags {
  display: flex;
  gap: .35rem;
  flex-wrap: wrap;
  margin-block: .35rem;
}

.tag {
  color: var(--color-muted);
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgb(48, 48, 48);
  padding: .25rem .45rem;
  line-height: 1;
  border-radius: 50px;
}

.description {
  .text {
    block-size: 120px;
    overflow: auto;
  }
}
</style>