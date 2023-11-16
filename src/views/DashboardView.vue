<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useTRStore } from '@/stores/tr';
import { onBeforeMount } from 'vue';

const authStore = useAuthStore();
const trStore = useTRStore();

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}

onBeforeMount(() => {
  if (authStore.user) {
    trStore.login({ phoneNumber: authStore.user.phone, pin: authStore.user.pin.toString() });
  }
});
</script>

<template>
  <main class="dashboard">
    <h1>Dashboard</h1>
    <button type="button" @click="onLogoutClick">Logout</button>
  </main>
</template>
