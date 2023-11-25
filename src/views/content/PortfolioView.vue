<script setup lang="ts">
import TRAssetLoader from '@/components/loaders/TRAssetLoader.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { useTickerStore } from '@/stores/ticker';
import type { InstrumentFilled } from '@/types/tr/instrument';
import { computed, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const socket = useTRSocket();
const instrumentData = useInstrumentsStore();
const ticker = useTickerStore();

const detailPortfolio = authStore.user?.portfolios.find(p => p.id.toString() === router.currentRoute.value.params.id);

if (!detailPortfolio) {
  router.push({ name: 'dashboard' });
}

// TODO: Move into instrument store -> write a reusable map function that could be reused on the instrument detail page
const instruments = computed(() => detailPortfolio?.isins.map<InstrumentFilled | undefined>(isin => {
  const instrument = instrumentData.getInstrument(isin);
  if (!instrument) {
    return;
  }
  const instrumentTicker = ticker.getTicker(instrument!.tickerEventId!);

  if (!instrumentTicker) {
    return;
  }

  const ordersForInstrument = detailPortfolio.orders.filter(order => order.isin === isin);
  const currentAmount = ordersForInstrument.reduce((acc, value) => {
    acc += value.amount;

    return acc;
  }, 0);

  const priceOpen = +instrumentTicker!.open.price;
  const priceBid = +instrumentTicker!.bid.price;
  const value = +(currentAmount * priceBid).toFixed(2);

  let sentimentIntraDay = priceBid >= priceOpen
    ? 'sentiment-bullish'
    : 'sentiment-bearish';

  return {
    ...instrument,
    amount: currentAmount,
    value,
    priceBid,
    sentimentIntraDay,
  } as InstrumentFilled;
}));

function getInstrumentsData () {
  detailPortfolio?.isins.forEach(isin => {
    const existingInsrument = instrumentData.getInstrument(isin);
    if (existingInsrument) {
      // Re-sub for existing ticker of the instrument
      socket.sendMessage(`sub ${existingInsrument.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

      return;
    }

    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"stockDetails","id":"${isin}","jurisdiction":"DE"}`);
    socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`);
  });
}

onMounted(() => {
  getInstrumentsData();
});

onBeforeRouteLeave(() => {
  instruments.value?.forEach(instrumentData => {
    if (!instrumentData) {
      return;
    }

    socket.sendMessage(`unsub ${instrumentData.tickerEventId}`, { updateEventId: false });
  });
});
</script>

<template>
  <main class="portfolio-view view">
    <h1>{{ detailPortfolio?.name }}</h1>
    <div class="instruments" v-if="instruments && instruments?.length > 0">
      <!-- TODO: move into component InstrumentFilled -->
      <div class="instrument" v-for="instrument of instruments" :key="instrument?.instrument?.shortName">
        <TRAssetLoader asset-type="image" :image-id="instrument?.instrument.imageId!" />
        <div class="name">{{
          instrument?.instrument?.shortName }}</div>
        <div class="amount">Anzahl: {{ instrument?.amount }}</div>
        <div class="value">Wert: {{ instrument?.value }}</div>
        <div class="price" :class="instrument?.sentimentIntraDay">Preis: {{ instrument?.priceBid }}</div>
        <hr>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
</style>
