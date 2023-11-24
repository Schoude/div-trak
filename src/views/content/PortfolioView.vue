<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();

const detailPortfolio = authStore.user?.portfolios.find(p => p.id.toString() === router.currentRoute.value.params.id);

if (!detailPortfolio) {
  router.push({ name: 'dashboard' });
}
</script>

<template>
  <main class="portfolio-view view">
    <h1>{{ detailPortfolio?.name }}</h1>
    {{ detailPortfolio?.isins }}
  </main>
</template>

<style scoped lang="scss">
.portfolio-view {
  padding-inline: .5rem;
}
</style>
