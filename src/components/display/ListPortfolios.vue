<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import ButtonAction from '../buttons/ButtonAction.vue';
import IconAdd from '../icons/IconAdd.vue';

const authStore = useAuthStore();
</script>

<template>
  <h1 class="title-portfolios">Your Portfolios</h1>
  <ButtonAction variant="dawn" class="button-new-portfolio">
    <div class="content">
      <IconAdd />
      <span>New Portfolio</span>
    </div>
  </ButtonAction>

  <ul class="list">
    <li>
      <RouterLink :to="{ name: 'portfolio', params: { id: portfolio.id } }"
        v-for="portfolio of authStore.user?.portfolios" class="portfolio" :key="portfolio.name">
        <div class="name text-l">{{ portfolio.name }}</div>
        <div class="count-instruments">Instruments: {{ portfolio.isins.length }}</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang='scss' scoped>
@use '../../styles/mixins';

.title-portfolios {
  margin-block-end: 1rem;
}

.button-new-portfolio {
  margin-block-end: 1rem;
  block-size: 2.25rem;
  inline-size: fit-content;

  .content {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding-inline: 1rem 1.3rem;
  }

  .icon-add {
    fill: currentColor;
  }
}

.list {
  padding: 0;
  list-style: none;
}

.portfolio {
  display: block;
  padding: .35rem .6rem;
  border-radius: 8px;
  text-decoration: none;
  outline: none;
  @include mixins.bg-list-item;

  &:visited {
    color: currentColor;
  }
}
</style>
