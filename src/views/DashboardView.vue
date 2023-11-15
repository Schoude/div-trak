<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}

</script>

<template>
  <main class="dashboard">
    <h1>Dashboard</h1>
    <button type="button" @click="onLogoutClick">Logout</button>
  </main>
</template>
