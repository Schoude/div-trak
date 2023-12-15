<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendListItem from '@/components/lists/DividendListItem.vue';
import { supabase } from '@/supabase/client';
import type { DbResult } from '@/supabase/types/helpers';
import { DividendType, type Dividend } from '@/types/tr/events/stock-details';
import { computed } from 'vue';

const props = defineProps<{
  isLoading: boolean;
  scrapedDividends: Dividend[];
  isin: string;
}>();

const canConfirmDividends = computed(() => !props.isLoading && props.scrapedDividends.length > 0);

async function onConfirmDividendClick (dividend: Dividend) {
  const upsertScrapedDividendQuery = supabase
    .from('dividends_scraped')
    .upsert({
      isin: props.isin,
      isin_ex_date: `${props.isin}-${dividend.exDate}`,
      ex_date: dividend.exDate,
      record_date: dividend.recordDate,
      payment_date: dividend.paymentDate,
      amount: dividend.amount,
      information: dividend.information,
      type: DividendType.Cash,
    }, {
      onConflict: 'isin_ex_date',
    })
    .select()
    .single();

  const uptedPortfolioResult: DbResult<typeof upsertScrapedDividendQuery> =
    await upsertScrapedDividendQuery;

  if (uptedPortfolioResult.error) {
    console.error(uptedPortfolioResult.error);

    return;
  }

  // TODO: add to to seperate pinia store dividends-scraped. they should be merged into the other dividend arrays
  // and also loaded after use login
  console.log(uptedPortfolioResult.data);
}
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
              <ButtonAction class="button-dividend-confirm" variant="dawn" :disabled="!canConfirmDividends"
                @click="onConfirmDividendClick(dividend)">
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
</style>