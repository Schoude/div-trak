<script setup lang="ts">
import type { Instrument } from '@/types/tr/instrument';
import type { SectorData, TreemapStructure } from '@/types/tr/portfolio';
import { computed, reactive, watch } from 'vue';
import ChartSectorsInPortfolio from './ChartSectorsInPortfolio.vue';

const props = defineProps<{
  instruments: Instrument[];
}>();

const existingSectors = reactive(new Map<string, SectorData>());
const sortedSectors = computed(() => [...existingSectors.values()].sort((a, b) => b.instruments.length - a.instruments.length));
const sectorsForTreemap = computed(() => {
  return {
    name: 'sectors',
    children: sortedSectors.value.map(sector => {
      return {
        name: sector.sector.name,
        count: sector.instruments.length,
      };
    }),
  } as TreemapStructure;
});

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

        existingInsruments.push({ name: instrument.instrument.shortName });

        return;
      } else {
        existingSectors.set(tag.id, {
          sector: tag,
          instruments: [{ name: instrument.instrument.shortName }],
        });
      }
    });
  });
}
</script>

<template>
  <section class="sectors-in-portfolio">
    <h2>Sectors in Portfolio <small class="text-s">({{ existingSectors.size }})</small></h2>

    <ChartSectorsInPortfolio v-if="sortedSectors.length > 0" :sector-data="sectorsForTreemap" />

    <div class="sectors">
      <div class="sector" v-for="sector of sortedSectors" :key="sector.sector.id">
        <div class="metadata text-m">
          <img :src="sector.sector.icon" :alt="sector.sector.name">
          <div class="name">{{ sector.sector.name }} <small class="text-s">({{ sector.instruments.length }})</small></div>
        </div>

        <ul>
          <li class="sector-instruments" v-for="instrument of sector.instruments" :key="instrument.name">
            {{ instrument.name }}
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
