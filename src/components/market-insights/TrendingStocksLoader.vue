<script setup lang='ts'>
import { onErrorCaptured, ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonAction from '../buttons/ButtonAction.vue';
import TrendingStocks from './TrendingStocks.vue';

const router = useRouter();
const hasError = ref(false);

onErrorCaptured((e) => {
  console.log(e);
  hasError.value = true;
});

function onNavigateToTRAuth () {
  router.push({ name: 'tr-auth' });
}
</script>

<template>
<div class="trending-stocks-loader">
  <Suspense>

    <template #default>
      <TrendingStocks />
    </template>

    <template #fallback>
      <p v-if="!hasError">Loading Trending Stocks</p>
      <template v-else>
        <p>The TR credentials are invalid.</p>
        <ButtonAction variant="dusk" class="button-link button-link-tr-auth" @click="onNavigateToTRAuth">Login to TR</ButtonAction>
      </template>
    </template>
  </Suspense>
</div>
</template>

<style lang='scss' scoped>
.button-link {
  inline-size: fit-content;
  padding-inline: 1rem 1rem;
  block-size: 2.25rem;
}
</style>
