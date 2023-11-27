<script setup lang="ts">
import type { Company } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';

defineProps<{
  company: Company;
}>();
</script>

<template>
  <div class="company-info">
    <h3>Indicators</h3>
    <div class="indicators">
      <span v-if="company.dividendYieldSnapshot" class="indicator">Yield: {{ company.dividendYieldSnapshot * 100 }}
        %</span>
      <span v-if="company.beta" class="indicator">Beta: {{ company.beta }}</span>
      <span v-if="company.eps" class="indicator">EPS: {{ formatNumber(company.eps, { style: 'currency', currency: 'USD' })
      }}</span>
      <span v-if="company.peRatioSnapshot" class="indicator">Price-to-Earnings: {{ company.peRatioSnapshot }}</span>
      <span v-if="company.pbRatioSnapshot" class="indicator">Price-to-Book: {{ company.pbRatioSnapshot * 100 }} %</span>
    </div>

    <h3>Company & People</h3>
    <div class="people">
      <span v-if="company.employeeCount">Employees: {{ company.employeeCount }}</span>
      <span v-if="company.yearFounded">Founding Year: {{ company.yearFounded }}</span>
      <span v-if="company.ceoName">CEO: {{ company.ceoName }}</span>
      <span v-if="company.cfoName">CFO: {{ company.cfoName }}</span>
      <span v-if="company.cooName">COO: {{ company.cooName }}</span>
    </div>

    <p class="description">{{ company.description }}</p>
  </div>
</template>

<style lang="scss">
.company-info {
  margin-block-start: 1.35rem;
}


h3 {
  margin-block-end: .35rem;
}

.indicators,
.people {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .35rem;
  margin-block-end: 1.35rem;
}

.description {
  block-size: 120px;
  overflow: auto;
}
</style>