<script setup lang='ts'>
import IconLogout from '@/components/icons/IconLogout.vue';
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();
const route = useRoute();

const portfolioLinkVisible = computed(() => portfolioStore.detailPortfolio && route.name !== 'dashboard' && route.name !== 'portfolio');
const portfolioLink = computed(() => `/portfolio/${portfolioStore.detailPortfolio?.id}`);

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}
</script>

<template>
  <header class="app-bar">
    <nav>
      <RouterLink to="/dashboard">
        <LogoDivTrak />
      </RouterLink>
      <RouterLink class="text-m" v-if="portfolioLinkVisible" :to="portfolioLink">
        Portfolio
      </RouterLink>
    </nav>

    <button type="button" class="btn-logout" @click="onLogoutClick" title="Log out from Div-Trak">
      <IconLogout />
    </button>
  </header>
</template>

<style lang='scss' scoped>
@use '@/styles/mixins';

.app-bar {
  display: flex;
  align-items: center;
  padding-inline: .5rem;
  justify-content: space-between;
  inline-size: 100%;

  @media only screen and (width >=1440px) {
    max-inline-size: 1280px;
    margin-inline: auto;
  }
}

nav {
  display: flex;
  gap: 2rem;
  align-items: center;

  a {
    font-weight: 700;
  }
}

.btn-logout {
  inline-size: 3rem;
  block-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @include mixins.outline;

  .icon {
    fill: white;
    inline-size: 2rem;
    block-size: 2rem;
  }
}
</style>
