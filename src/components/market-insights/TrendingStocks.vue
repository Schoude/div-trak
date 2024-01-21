<script setup lang='ts'>
import type { TrendingStocks } from '@/composables/useTRAuth';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { onBeforeRouteLeave } from 'vue-router';

// import { useTRAuth } from '@/composables/useTRAuth';
// import { useAuthStore } from '@/stores/auth';

// const auth = useAuthStore();
// const trAuth = useTRAuth();

// await trAuth.trendingStocks(auth.user?.id!);
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();

const trendingStocks: TrendingStocks = {
  'items': [
    {
      'isin': 'US71948P1003',
      'shortName': 'Phunware',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US67066G1040',
      'shortName': 'NVIDIA',
      'instrumentType': 'stock',
    },
    {
      'isin': 'FR001400JX97',
      'shortName': 'Pixium Vision',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US0079031078',
      'shortName': 'AMD',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US88160R1014',
      'shortName': 'Tesla',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US0378331005',
      'shortName': 'Apple',
      'instrumentType': 'stock',
    },
    {
      'isin': 'DE0007030009',
      'shortName': 'Rheinmetall',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US8485771021',
      'shortName': 'Spirit Airlines',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US44812J1043',
      'shortName': 'HUT 8',
      'instrumentType': 'stock',
    },
    {
      'isin': 'US8740391003',
      'shortName': 'TSMC (ADR)',
      'instrumentType': 'stock',
    },
  ],
};

// TODO: figure out timing and null values except the last stock...
// -> eventId does not match
trendingStocks.items.forEach(item => {
  socket.sendMessage(`sub ${socket.runningEventId.value} {"type":"instrument","id":"${item.isin}","jurisdiction":"DE"}`);
});

onBeforeRouteLeave(() => {
  trendingStocks.items.forEach(instrument => {
    const existingInsrument = instrumentStore.getInstrument(instrument.isin);
    if (existingInsrument) {
      socket.sendMessage(`unsub ${existingInsrument.tickerEventId}`, { updateEventId: false });
    }
  });
});
</script>

<template>
  <div class="trending-stocks">
    <h2>Trending Stocks</h2>
    <p>Trending Stocks loaded</p>
    <!-- {{ trendingInstruments }} -->
    <!-- <template v-for="instrument of trendingInstruments">
    <p>
      <span>{{ instrument }}</span>
    </p>
  </template> -->
  </div>
</template>

<style lang='scss' scoped>
</style>
