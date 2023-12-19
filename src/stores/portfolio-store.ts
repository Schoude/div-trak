import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePortfolioStore = defineStore('portfolios', () => {
  const authStore = useAuthStore();
  const instrumentStore = useInstrumentsStore();

  const selectedPortfolioID = ref<number | null>(null);

  const detailPortfolio = computed(() => {
    return authStore.user?.portfolios.find(p => p.id === selectedPortfolioID.value);
  });

  const instruments = computed(() => instrumentStore.getInstrumentsFilled(detailPortfolio.value!)?.sort((a, b) => b.value - a.value));

  return {
    selectPortfolio (id: number | null) {
      selectedPortfolioID.value = id;
    },
    detailPortfolio,
    instruments,
  };
});
