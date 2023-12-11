<script setup lang='ts'>
import FundDetail from '@/components/detail-views/FundDetail.vue';
import StockDetail from '@/components/detail-views/StockDetail.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useAggretatesStore } from '@/stores/aggregates';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { useTickerStore } from '@/stores/ticker';
import type { Ticker } from '@/types/tr/events/aggregate-history';
import { isETF, isStock } from '@/types/tr/instrument';
import { computed, ref, watch, watchEffect } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router';

const socket = useTRSocket();
const portfolioStore = usePortfolioStore();
const instruments = useInstrumentsStore();
const ticker = useTickerStore();
const router = useRouter();
const isin = ref('');

const instrumentData = computed(() => instruments.getInstrument(isin.value));
const tickerData = computed(() => ticker.getTicker(instrumentData.value?.tickerEventId!));
const isInDetailPortfolio = computed(() => portfolioStore.detailPortfolio?.isins.includes(isin.value) ?? false);
const aggregateHistoryStore = useAggretatesStore();

watchEffect(() => {
  isin.value = router.currentRoute.value.params.isin as string;
  useAggretatesStore().isin = isin.value;
});

watch(tickerData, (ticker) => {
  if (!aggregateHistoryStore.aggregateHistory) {
    return;
  }

  let lastCandle = aggregateHistoryStore.aggregateHistory.aggregates.at(-1);

  if (!lastCandle || !ticker) {
    return;
  }

  const drawNewCandle = (ticker.bid.time - lastCandle.time) > aggregateHistoryStore.aggregateHistory.resolution;

  // Add new candle if resolution limit is exceeded
  if (drawNewCandle) {
    const newCandle: Ticker = {
      adjValue: ticker.bid.price,
      open: ticker.bid.price,
      close: ticker.bid.price,
      high: ticker.bid.price,
      low: ticker.bid.price,
      time: Math.round((ticker.bid.time / 100000)) * 100000,
      volume: ticker.bid.size,
    };

    aggregateHistoryStore.aggregateHistory.aggregates.push(newCandle);

    return;
  }

  // Set "current" = close time
  lastCandle.close = ticker.bid.price;

  // Set "low" price for the candle
  if (ticker.bid.price < lastCandle.low) {
    lastCandle.low = ticker.bid.price;
  }

  // Set "high" price for the candle
  if (ticker.bid.price > lastCandle.high) {
    lastCandle.high = ticker.bid.price;
  }

  // Cummulate volumes for the candle
  lastCandle.volume = lastCandle.volume + ticker.bid.size;
});

onBeforeRouteLeave(() => {
  socket.sendMessage(`unsub ${instrumentData.value?.tickerEventId}`, { updateEventId: false });
});

onBeforeRouteUpdate((guard) => {
  startTicker(guard.params.isin as string);
});

function startTicker (isin: string) {
  if (instruments.getInstrument(isin)) {
    // Re-sub for existing ticker of the instrument
    socket.sendMessage(`sub ${instrumentData.value?.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

    return;
  }

  socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
}

startTicker(isin.value);
</script>

<template>
  <main class="instrument-view view">
    <template v-if="!instrumentData || !tickerData">
      <p>Loading Data...</p>
    </template>

    <template v-else>
      <template v-if="isStock(instrumentData) && tickerData">
        <StockDetail :stock="instrumentData" :ticker="tickerData" :is-in-detail-portfolio="isInDetailPortfolio"
          :history="aggregateHistoryStore.aggregateHistory" />
      </template>
      <template v-if="isETF(instrumentData) && tickerData">
        <FundDetail :etf="instrumentData" :ticker="tickerData" :is-in-detail-portfolio="isInDetailPortfolio"
          :history="aggregateHistoryStore.aggregateHistory" />
      </template>
    </template>
  </main>
</template>

<style lang='scss' scoped></style>
