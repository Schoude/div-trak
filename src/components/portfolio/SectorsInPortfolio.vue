<script setup lang="ts">
import type { Tag } from '@/types/tr/events/instruments';
import type { Instrument } from '@/types/tr/instrument';
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  instruments: Instrument[];
}>();

interface SectorData {
  sector: Tag;
  instruments: Instrument[];
}

const existingSectors = reactive(new Map<string, SectorData>());
const sortedSectors = computed(() => [...existingSectors.values()].sort((a, b) => b.instruments.length - a.instruments.length));

watch(() => props.instruments.length, () => {
  fillSectors();
}, {
  immediate: true,
});

function fillSectors () {
  existingSectors.clear();

  props.instruments.forEach(instrument => {
    const sectorTags = instrument.instrument.tags.filter(tag => tag.type === 'sector');

    sectorTags.forEach(tag => {
      const existingSector = existingSectors.get(tag.id);

      if (existingSector) {
        const existingInsruments = existingSector.instruments;

        existingInsruments.push(instrument);
        existingSector.instruments;

        return;
      } else {
        existingSectors.set(tag.id, {
          sector: tag,
          instruments: [instrument],
        });
      }
    });
  });
}
</script>

<template>
  <section class="sectors-in-portfolio">
    <h2>Sectors in Portfolio <small class="text-s">({{ existingSectors.size }})</small></h2>
    <div class="sectors">
      <div class="sector" v-for="sector of sortedSectors" :key="sector.sector.id">
        <div class="metadata text-m">
          <img :src="sector.sector.icon" :alt="sector.sector.name">
          <div class="name">{{ sector.sector.name }} <small class="text-s">({{ sector.instruments.length }})</small></div>
        </div>

        <ul>
          <li class="sector-instruments" v-for="instrument of sector.instruments" :key="instrument.instrument.isin">
            {{ instrument.instrument.shortName }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sectors-in-portfolio {
  margin-block: 2.125rem;
}

.sectors {
  display: grid;
  gap: 1rem;
  padding-block-start: 1rem;

  @media only screen and (width >=768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (width >=1280px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.metadata {
  display: flex;
  gap: .5rem;
  align-items: center;

  img {
    inline-size: 1rem;
    block-size: 1rem;
    filter: invert(1);
  }
}
</style>