<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import { useDividendsScrapedStore } from '@/stores/dividends-scraped';
import { type Dividend } from '@/types/tr/events/stock-details';
import { computed } from 'vue';

const props = defineProps<{
  isLoading: boolean;
  scrapedDividends: Dividend[];
  isin: string;
}>();

const emit = defineEmits<{
  loading: [isLoading: boolean];
  close: [],
  'update:scraped-dividend-added': [exData: string];
}>();

const dividendsScrapedStore = useDividendsScrapedStore();

const canConfirmDividends = computed(() => !props.isLoading && props.scrapedDividends.length > 0);
const scrapedDividendsSortedByDate = computed(() => props.scrapedDividends
  .map(dividend => {
    return {
      ...dividend,
      sortBy: new Date(dividend.paymentDate).getTime(),
    };
  })
  .sort((a, b) => a.sortBy - b.sortBy),
);

async function onConfirmDividendClick (dividend: Dividend) {
  if (props.isLoading) {
    return;
  }

  try {
    emit('loading', true);

    const addNewDividend = await dividendsScrapedStore.addNewDividend(dividend, props.isin);

    emit('update:scraped-dividend-added', addNewDividend.ex_date);
  } catch (error) {
    console.error(error);
  } finally {
    emit('loading', false);
  }
}
</script>

<template>
  <div class="dividend-scraped-confirmation">
    <div class="scraped-dividends">
      <template v-if="scrapedDividends.length > 0">
        <p class="confirmation-disclaimer">
          Confirm the scraped dividends for instrument {{ isin }}.
        </p>
        <ul>
          <DividendListItem v-for="dividend of scrapedDividendsSortedByDate" :dividend="dividend" :key="dividend.id"
            :show-delete-button="false">
            <template #action>
              <div class="confirmation">
                <ButtonAction class="button-dividend-confirm" variant="dawn" :disabled="!canConfirmDividends"
                  @click="onConfirmDividendClick(dividend)">
                  Confirm dividend
                </ButtonAction>
              </div>
            </template>
          </DividendListItem>
        </ul>
      </template>
      <template v-else>
        <ButtonAction class="button-close" variant="dusk" @click="$emit('close')">
          Close modal
        </ButtonAction>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dividend-scraped-confirmation {
  display: flex;
}

.confirmation-disclaimer {
  margin-block-end: .65rem;
  padding-inline: 1rem;
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

.button-close {
  block-size: 2rem;
  font-size: .85rem;
  padding-inline: 1rem;
}
</style>