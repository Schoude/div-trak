<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendCalendar from '@/components/dividend-calendar/DividendCalendar.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import InstrumentListItem from '@/components/lists/InstrumentListItem.vue';
import SectorsInPortfolio from '@/components/portfolio/SectorsInPortfolio.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

portfolioStore.selectPortfolio(+router.currentRoute.value.params.id);

if (!portfolioStore.detailPortfolio) {
  router.push({ name: 'dashboard' });
}

const portfolioValue = computed(() => portfolioStore.instruments.reduce((acc, instrument) => {
  acc += instrument.value;

  return acc;
}, 0));


function startTicker () {
  portfolioStore.detailPortfolio?.isins.forEach(isin => {
    const existingInsrument = instrumentStore.getInstrument(isin);
    if (existingInsrument) {
      // Re-sub for existing ticker of the instrument
      socket.sendMessage(`sub ${existingInsrument.tickerEventId} {"type":"ticker","id":"${isin}.LSX","jurisdiction":"DE"}`, { updateEventId: false });

      return;
    }
  });
}

startTicker();

onBeforeRouteLeave(() => {
  portfolioStore.instruments.forEach(instrumentData => {
    if (!instrumentData) {
      return;
    }

    socket.sendMessage(`unsub ${instrumentData.tickerEventId}`, { updateEventId: false });
  });
});
</script>

<template>
  <main class="portfolio-view view">
    <h1 class="portfolio-name">
      <span>
        {{ portfolioStore.detailPortfolio?.name }}
      </span>
      <ButtonAction type="button" variant="dusk" class="button-portfolio-edit" title="Open portfolio edit modal.">
        <IconEdit />
      </ButtonAction>
    </h1>

    <div class="portfolio-value text-m">{{ formatNumber(portfolioValue, { style: 'currency', currency: 'EUR' }) }}</div>

    <DividendCalendar />

    <div class="instruments">
      <h2>Instruments <small class="text-s">({{ portfolioStore.detailPortfolio?.isins.length }})</small></h2>
      <ul class="instruments-list" v-if="portfolioStore.instruments && portfolioStore.instruments?.length > 0">
        <InstrumentListItem :instrument="instrument" v-for="instrument of portfolioStore.instruments"
          :key="instrument?.instrument?.shortName" />
      </ul>
    </div>

    <SectorsInPortfolio v-if="portfolioStore.instruments" :instruments="portfolioStore.instruments" />
  </main>
</template>

<style scoped lang="scss">
.portfolio-name {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-portfolio-edit {
  block-size: 2rem;
  inline-size: 2rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon-edit {
    fill: currentColor;
    inline-size: 1.3rem;
  }
}

.instruments-list {
  padding: 0;
  padding-block-start: 1rem;
  display: grid;
  gap: 1rem;

  @media only screen and (width >=768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (width >=1280px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
