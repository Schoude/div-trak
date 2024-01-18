<script setup lang='ts'>
import { useTRAuth } from '@/composables/useTRAuth';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const trAuth = useTRAuth();

await trAuth.trendingStocks(auth.user?.id!);
</script>

<template>
<div class="trending-stocks">
  <h2>Trending Stocks</h2>
  <p>Trending Stocks loaded</p>
</div>
</template>

<style lang='scss' scoped>
</style>
