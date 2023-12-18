<script setup lang="ts">
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import DividendCalendar from '@/components/dividend-calendar/DividendCalendar.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import InstrumentListItem from '@/components/lists/InstrumentListItem.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import SectorsInPortfolio from '@/components/portfolio/SectorsInPortfolio.vue';
import { useTRSocket } from '@/composables/useTRSocket';
import { useInstrumentsStore } from '@/stores/instruments';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatNumber } from '@/utils/intl/currency';
import { computed, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const socket = useTRSocket();
const instrumentStore = useInstrumentsStore();
const portfolioStore = usePortfolioStore();

// Portfolio edit
const editPortfolioModal = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);
const newPortfolioName = ref('');
const isLoading = ref(false);
const canSend = computed(() => !isLoading.value || newPortfolioName.value !== '');

portfolioStore.selectPortfolio(+router.currentRoute.value.params.id);

if (!portfolioStore.detailPortfolio) {
  router.push({ name: 'dashboard' });
}

const portfolioValue = computed(() => portfolioStore.instruments.reduce((acc, instrument) => {
  acc += instrument.value;

  return acc;
}, 0));

watch(modalIsOpen, (isOpen) => {
  if (!isOpen) {
    return;
  }

  newPortfolioName.value = portfolioStore.detailPortfolio?.name!;
});

function onModalClose () {
  editPortfolioModal.value?.$el.close();
  modalIsOpen.value = false;
  newPortfolioName.value = '';
}

function onOpenModalOpen () {
  editPortfolioModal.value?.$el.showModal();
  modalIsOpen.value = true;
}

async function onSaveEditedPortfolio () {
  if (!canSend.value) {
    return;
  }

  try {
    isLoading.value = true;

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

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
      <ButtonAction type="button" variant="dusk" class="button-portfolio-edit" title="Open portfolio edit modal."
        @click="onOpenModalOpen">
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

    <ModalBase class="modal-edit-portfolio" ref="editPortfolioModal" @close="onModalClose">
      <template #title>Edit Portfolio {{ portfolioStore.detailPortfolio?.name }}</template>
      <template #content>
        <div v-if="modalIsOpen" class="inner">
          <LabelFormInput for-input="phone" text="New Portfolio Name">
            <InputText v-model="newPortfolioName" id="new-name-portfolio" placeholder="My new Portfolio" />
          </LabelFormInput>

          <ButtonAction type="button" variant="dawn" class="button-save-portfolio" @click="onSaveEditedPortfolio">
            <span>Save Portfolio</span>
          </ButtonAction>
        </div>
      </template>
    </ModalBase>
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

.modal-edit-portfolio {
  max-inline-size: 500px;
  overflow: hidden;
  
  .inner {
    padding-inline: .5rem;
    padding-block-end: .5rem;
  }
}
</style>
