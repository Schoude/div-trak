<script setup lang='ts'>
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { ETFSearchResult, StockSearchResult } from '@/types/tr/neon-search';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  result: StockSearchResult | ETFSearchResult;
}>();

const emit = defineEmits([
  'hide:navigation'
]);

const router = useRouter();

const tags = computed(() => props.result.tags.map(t => t.name).join(', '));

async function onNavigateClick (isin: string) {
  await router.push({ name: 'instrument', params: { isin } });
  emit('hide:navigation');
}
</script>

<template>
  <li class="search-result-list-item">
    <!-- TODO: handle navigation to instrument detail page -->
    <button class="result-action" type="button" @click="onNavigateClick(result.isin)">
      <TRAssetLoader :image-id="result.imageId" asset-type="image" />
      <div class="details">
        <div class="name">{{ result.name }}</div>
        <div class="tags text-xs">{{ tags }}</div>
      </div>
    </button>
  </li>
</template>

<style lang='scss' scoped>
.result-action {
  inline-size: 100%;
  display: flex;
  align-items: center;
  padding: .65rem .5rem;
  transition: background-color 150ms ease-out;
  text-align: start;

  &:hover,
  &:focus {
    background-color: hsl(343, 37%, 2%);
  }
}

.name,
.tags {
  padding-inline-start: .5rem;
}

.tags {
  color: rgb(143, 143, 143);
  white-space: nowrap;
  text-overflow: ellipsis;
  inline-size: 100%;
  overflow: hidden;
}

.details {
  overflow: hidden;
}
</style>
