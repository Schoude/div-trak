<script setup lang="ts">
import { useTRSocket } from '@/composables/useTRSocket';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const socket = useTRSocket();

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}

function onSearchChange (event: Event) {
  const target = event.target as HTMLInputElement;

  socket.sendMessage(`sub 1 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}`);
  socket.sendMessage(`sub 2 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}`);

  socket.onMessage = (event) => {
    const jsonString = event.data;
    console.log(jsonString);
    socket.sendMessage('unsub 1');
    socket.sendMessage('unsub 2');
  };
}
</script>

<template>
  <main class="dashboard-view view">
    <h1>Dashboard</h1>
    <button type="button" @click="onLogoutClick">Logout</button>

    <input type="text" name="search" placeholder="Find stocks of ETFs" id="search" @change="onSearchChange">
  </main>
</template>
