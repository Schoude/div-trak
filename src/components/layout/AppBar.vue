<script setup lang='ts'>
import TagText from '@/components/display/TagText.vue';
import IconLogout from '@/components/icons/IconLogout.vue';
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import { useExchangeRatesStore } from '@/stores/exchange-rates';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatNumber } from '@/utils/intl/currency';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const portfolioStore = usePortfolioStore();
const exchangeRateStore = useExchangeRatesStore();
const route = useRoute();

const portfolioLinkVisible = computed(() => portfolioStore.detailPortfolio && route.name !== 'dashboard' && route.name !== 'portfolio');
const portfolioLink = computed(() => `/portfolio/${portfolioStore.detailPortfolio?.id}`);

async function onLogoutClick () {
  await authStore.endSession();
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

    <div class="column">
      <div class="exchange-rates">
        <TagText>
          USD | EUR: {{ formatNumber(exchangeRateStore.exchangeRates.USD_EUR, { currency: 'EUR', style: 'currency' }) }}
        </TagText>
        <TagText>
          EUR | USD: {{ formatNumber(exchangeRateStore.exchangeRates.EUR_USD, { style: 'currency', currency: 'USD' }) }}
        </TagText>
      </div>
      <button type="button" class="btn-logout" @click="onLogoutClick" title="Log out from Div-Trak">
        <IconLogout />
      </button>
    </div>
  </header>
</template>

<style lang='scss' scoped>
@use '@/styles/mixins';

.app-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-inline: .5rem;
  inline-size: 100%;

  @media only screen and (width >=1440px) {
    max-inline-size: 1280px;
    margin-inline: auto;
  }
}

nav {
  display: flex;
  gap: .75rem;
  align-items: center;

  @media only screen and (width >=1440px) {
    gap: 2rem;
  }

  a {
    font-weight: 700;
    flex: none;
  }
}

.exchange-rates,
.column {
  display: flex;
  align-items: center;
  gap: .35rem;
  justify-content: end;
}

.exchange-rates {
  flex-wrap: wrap;
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
