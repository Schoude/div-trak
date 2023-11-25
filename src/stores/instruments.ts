import type { Instrument } from '@/types/tr/instrument';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInstrumentsStore = defineStore('instruments', () => {
  const instruments = ref(new Map<string, Partial<Instrument>>());

  function setInstrument (isin: string, instrument: Partial<Instrument>) {
    instruments.value.set(isin, instrument);
  }

  return {
    instruments,

    getInstrument (isin: string) {
      return instruments.value.get(isin);
    },
    upsertInstrument (isin: string, updateData: Partial<Instrument>) {
      const toUpdate = this.getInstrument(isin);

      if (!toUpdate) {
        setInstrument(isin, { ...updateData });

        return;
      }

      const updated = Object.assign(toUpdate, { ...updateData });
      setInstrument(isin, updated);
    },
  };
});

const a = useInstrumentsStore();
