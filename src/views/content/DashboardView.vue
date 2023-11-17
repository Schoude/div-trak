<script setup lang="ts">
import IconTR from '@/components/icons/IconTR.vue';
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import { useTRStore } from '@/stores/tr';
import type { TRLoginError, TRLoginReturnValue } from '@/types/tr';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const trStore = useTRStore();

const loginDataTR = ref<TRLoginReturnValue | TRLoginError | null>(null);
const needs2FA = computed(() => {
  if (!loginDataTR.value) return false;

  return '2fa' in loginDataTR.value;
});
const loginError = computed(() => {
  if (!loginDataTR.value) return false;

  return 'errors' in loginDataTR.value;
});

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}

async function onConnectToTRClick (){
  if (authStore.user) {
    loginDataTR.value = await trStore.login({
       phoneNumber: authStore.user.phone,
       pin: authStore.user.pin.toString()
    });
  }
}

async function onConfirm2FAClick () {
  if (
    authStore.user &&
    needs2FA.value &&
    loginDataTR.value &&
    'processId' in loginDataTR.value
  ) {
    trStore.trSession = await trStore.confirm2FA({
      loginCookies: loginDataTR.value.loginCookies.join(),
      processId: loginDataTR.value.processId,
      pin: authStore.user?.pin.toString(),
    });
  }
}

function onRetryClick () {
  loginDataTR.value = null;

  onConnectToTRClick();
}

</script>

<template>
  <header>
    <nav>
      <RouterLink to="/dashboard">
        <LogoDivTrak />
      </RouterLink>
    </nav>
  </header>

  <main class="dashboard-view view">
    <h1>Dashboard</h1>
    <button type="button" @click="onLogoutClick">Logout</button>
    <div class="tr-connection">
      <div>needs2FA {{ needs2FA }}</div>
      <div>loginError {{ loginError }}</div>

      <template v-if="trStore.trSession === null && loginDataTR == null">
        <button type="button" @click="onConnectToTRClick">
          <p>Connect to</p>
          <IconTR />
        </button>
      </template>

      <template v-else-if="needs2FA">
        <input type="text" :value="authStore.user?.pin">
        <button type="button" @click="onConfirm2FAClick">Confirm your PIN</button>
      </template>

      <template v-else-if="loginError && 'errors' in loginDataTR!">
        <template v-for="(error, index) of loginDataTR.errors" :key="index">
          <h2>{{ error.errorCode }}</h2>
          <div>Time to next attempt: {{error.meta.nextAttemptInSeconds }}</div>
          <button type="button" @click="onRetryClick">RETRY</button>
        </template>
      </template>
    </div>
  </main>
</template>
