<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import type { Dividend } from '@/types/tr/events/stock-details';
import { computed } from 'vue';

const props = defineProps<{
  isLoading: boolean;
  scrapedDividends: Dividend[];
  isin: string;
}>();

const canConfirmDividends = computed(() => !props.isLoading && props.scrapedDividends.length > 0);
</script>

<template>
  <div class="dividend-scraped-confirmation">
    <div class="scraped-dividends">
      <p class="confirmation-disclaimer">
        Confirm the scraped dividends for instrument {{ isin }}.
      </p>
      <ul>
        <DividendListItem v-for="dividend of scrapedDividends" :dividend="dividend" :key="dividend.id">
          <template #action>
            <div class="confirmation">
              <ButtonAction class="button-dividend-confirm" variant="dawn" :disabled="!canConfirmDividends">
                Confirm dividend
              </ButtonAction>
            </div>
          </template>
        </DividendListItem>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dividend-scraped-confirmation {
  display: flex;
}

.confirmation-disclaimer {
  margin-block-end: .65rem;
}

.scraped-dividends {
  display: grid;
  place-content: center;
  justify-items: center;
  flex: 1;

  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .confirmation {
    margin-block-start: .5rem;
  }
}

.button-dividend-confirm {
  block-size: 1.75rem;
  font-size: .85rem;
}
</style>