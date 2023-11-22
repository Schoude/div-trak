<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <h1 class="title-portfolios">Your Portfolios</h1>
  <ul class="list">
    <li>
      <RouterLink :to="{ name: 'portfolio', params: { id: portfolio.id } }" v-for="portfolio of authStore.user?.portfolios"
        class="portfolio" :key="portfolio.name">
        <div class="name text-l">{{ portfolio.name }}</div>
        <div class="count-instruments">Instruments: {{ portfolio.isins.length }}</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang='scss' scoped>
.title-portfolios {
  margin-block-end: 1rem;
}

.list {
  padding: 0;
  list-style: none;
}

.portfolio {
  display: block;
  background-color: rgba(12, 12, 12, 0.3);
  padding: .35rem .6rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 150ms ease-out;
  outline: none;
  box-shadow: var(--shadow);

  &:visited {
    color: currentColor;
  }

  &:hover,
  &:focus-visible {
    background-color: rgba(10, 10, 10, 0.6);
  }
}
</style>
