<script setup lang='ts'>
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import IconLogout from '../icons/IconLogout.vue';

const authStore = useAuthStore();

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
