<script setup lang='ts'>
import { createAssetURL, type AssetType } from '@/utils/tr/assets';
import { onMounted, ref } from 'vue';

defineProps<{
  assetType: AssetType,
  imageId: string;
}>();

const image = ref<HTMLImageElement | null>(null);
const showFallback = ref(false);

onMounted(() => {
  if (image.value) {
    image.value!.onerror = () => {
      showFallback.value = true;
    };
  }
});

</script>

<template>
  <img v-if="!showFallback" class="tr-asset-loader" ref="image" width="40" :src="createAssetURL(assetType, imageId)">
  <div v-else class="wrapper">
    <svg viewBox="0 0 20 20" class="fallback">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M19.643 7.342C19.876 8.188 20 9.08 20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0a9.955 9.955 0 016.736 2.609L15.37 4.07a8 8 0 102.324 3.73l1.54-1.647c.16.385.297.782.409 1.189z">
      </path>
      <path
        d="M9.344 9.817L5.223 14c-.455-.412-.945-1.007-1.223-1.656l4.934-5.047c.19-.195.495-.2.691-.012l1.986 1.904L18.44 2.15c.193-.199.506-.2.7-.003l.712.718c.197.2.199.525.004.727l-7.843 8.105a.488.488 0 01-.692.014L9.344 9.817z">
      </path>
    </svg>
  </div>
</template>

<style lang='scss' scoped>
.wrapper {
  inline-size: 40px;
}

.fallback {
  display: block;
  margin: auto;
  fill: white;
  inline-size: 20px;
}
</style>
