import { supabase } from '@/supabase/client';
import type { Tables } from '@/supabase/types/database';
import type { DbResult } from '@/supabase/types/helpers';
import { type Dividend } from '@/types/tr/events/stock-details';
import { defineStore } from 'pinia';
import { computed, nextTick, reactive, readonly } from 'vue';

type DividendScraped = Tables<'dividends_scraped'>;

export const useDividendsScrapedStore = defineStore('dividends-scraped', () => {
  const scrapedDividends = reactive(new Map<string, DividendScraped>());

  const scrapedDividendsArray = computed(() => [...scrapedDividends.values()]);

  return {
    async loadScrapedDividends () {
      if (scrapedDividends.size > 0) {
        return;
      }

      const loadScrapedDividendsQuery = supabase
        .from('dividends_scraped')
        .select();

      const loadScrapedDividendsQueryResult: DbResult<
        typeof loadScrapedDividendsQuery
      > = await loadScrapedDividendsQuery;

      if (loadScrapedDividendsQueryResult.error) {
        throw loadScrapedDividendsQueryResult.error;
      }

      loadScrapedDividendsQueryResult
        .data
        .map((dividend) => {
          scrapedDividends.set(
            dividend.isin_ex_date,
            dividend,
          );
        });
    },
    async addNewDividend (
      dividend: Dividend,
      isin: string,
    ): Promise<DividendScraped> {
      const upsertScrapedDividendQuery = supabase
        .from('dividends_scraped')
        .upsert({
          isin: isin,
          isin_ex_date: `${isin}-${dividend.exDate}`,
          ex_date: dividend.exDate,
          record_date: dividend.recordDate,
          payment_date: dividend.paymentDate,
          amount: dividend.amount,
          information: dividend.information,
          type: 'cash',
        }, {
          onConflict: 'isin_ex_date',
        })
        .select()
        .single();

      const upsertScrapedDividendResult: DbResult<
        typeof upsertScrapedDividendQuery
      > = await upsertScrapedDividendQuery;

      if (upsertScrapedDividendResult.error) {
        throw upsertScrapedDividendResult.error;
      }

      scrapedDividends.set(
        upsertScrapedDividendResult.data.isin_ex_date,
        upsertScrapedDividendResult.data,
      );

      return upsertScrapedDividendResult.data;
    },
    async deleteEstimatedDividend (isinExDate: string) {
      const deleteEstimatedDividendQuery = supabase
        .from('dividends_scraped')
        .delete()
        .eq('isin_ex_date', isinExDate);

      const deleteEstimatedDividendQueryResult: DbResult<
        typeof deleteEstimatedDividendQuery
      > = await deleteEstimatedDividendQuery;

      if (deleteEstimatedDividendQueryResult.error) {
        throw deleteEstimatedDividendQueryResult.error;
      }

      // @ts-expect-error bad dom types
      document.startViewTransition(async () => {
        scrapedDividends.delete(isinExDate);
        await nextTick();
      });
    },
    _scrapedDividendsArray: readonly(scrapedDividendsArray),
    getScrapedDividendsByISIN: computed(() => {
      return (isin: string) => {
        return scrapedDividendsArray.value.filter((dividend) =>
          dividend.isin === isin,
        );
      };
    }),
  };
});
