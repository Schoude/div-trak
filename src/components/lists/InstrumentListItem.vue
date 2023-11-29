<script setup lang="ts">
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import type { InstrumentFilled } from '@/types/tr/instrument';
import { useRouter } from 'vue-router';

const props = defineProps<{
  instrument: InstrumentFilled;
}>();

const router = useRouter();

async function onNavigateClick () {
  await router.push({ name: 'instrument', params: { isin: props.instrument.instrument.isin } });
}
</script>

<template>
  <li class="instrument-list-item">
    <button type="button" class="action" @click="onNavigateClick">

      <TRAssetLoader asset-type="image" :image-id="instrument.instrument.imageId!" />

      <div class="meta-data">
        <div class="name">{{
          instrument.instrument.shortName }}</div>
        <div class="values text-xs">
          <div class="value">{{ instrument.valueFormatted }}</div>
          <span>•</span>
          <div class="amount">{{ instrument.amount }} pcs.</div>
        </div>
      </div>

      <div class="price text-s" :class="instrument.sentimentIntraDay">{{ instrument.priceBid }}</div>
    </button>
  </li>
</template>

<style scoped lang="scss">
@use '../../styles/mixins';

.instrument-list-item {
  list-style: none;
  padding: .75rem;
  border-radius: 8px;
  @include mixins.bg-list-item;
}

.action {
  display: flex;
  inline-size: 100%;
  text-align: start;
  align-items: center;
}

.meta-data {
  flex: 1 0 auto;
  margin-inline: .85rem;
}

.name {
  max-inline-size: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.values {
  display: flex;
  gap: .25rem;
  color: var(--color-muted);
}

.price {
  font-weight: 700;
}
</style>
