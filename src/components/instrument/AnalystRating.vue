<script setup lang='ts'>
import type { AnalystRating } from '@/types/tr/events/stock-details';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';
import TagText from '../display/TagText.vue';

const props = defineProps<{
  analystRating: AnalystRating;
  currentPrice: number;
}>();

const upwardsMobility = computed(() => formatNumber((1 - props.currentPrice / props.analystRating?.targetPrice.high) * 100, { style: 'decimal', roundingMode: 'floor' }));
const downwardsMobility = computed(() => formatNumber((1 - props.currentPrice / props.analystRating?.targetPrice.low) * 100, { style: 'decimal', roundingMode: 'floor' }));
</script>

<template>
  <div class="analyst-rating text-s">
    <div class="recommendations">
      <h2 class="text-m">Recommendations</h2>

      <div class="grid">
        <div v-if="analystRating?.recommendations.outperform > 0" class="outperform recommendation">
          Outperform: {{ analystRating.recommendations.outperform }}
        </div>
        <div v-if="analystRating?.recommendations.buy > 0" class="buy recommendation">
          Buy: {{ analystRating.recommendations.buy }}
        </div>
        <div v-if="analystRating?.recommendations.hold > 0" class="hold recommendation">
          Hold: {{ analystRating.recommendations.hold }}
        </div>
        <div v-if="analystRating?.recommendations.sell > 0" class="sell recommendation">
          Sell: {{ analystRating.recommendations.sell }}
        </div>
        <div v-if="analystRating?.recommendations.underperform > 0" class="underperform recommendation">
          Underperform: {{ analystRating.recommendations.underperform }}
        </div>
      </div>
    </div>

    <div class="target-price">
      <h2 class="text-m">Target Prices</h2>
      <div class="grid">
        <div>High: {{ formatNumber(analystRating?.targetPrice?.high, { style: 'currency', currency: 'EUR' }) }} </div>
        <div>Average: {{ formatNumber(analystRating?.targetPrice?.average, { style: 'currency', currency: 'EUR' }) }}
        </div>
        <div>Low: {{ formatNumber(analystRating?.targetPrice?.low, { style: 'currency', currency: 'EUR' }) }} </div>
      </div>
      <div class="mobility text-s" style="color: var(--color-muted)">
        <TagText>To High: {{ upwardsMobility }} %</TagText>
        <TagText>To Low: {{ downwardsMobility }} %</TagText>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.analyst-rating {
  margin-block: 1.35rem;

  >div {
    margin-block-end: 1.35rem;
  }
}

h2 {
  margin-block-end: 0.35rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: .25rem;
}

.mobility {
  display: flex;
  justify-content: space-around;
  margin-block: 0.35rem;
}
</style>
