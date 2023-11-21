<script setup lang="ts">
import IconTR from '@/components/icons/IconTR.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const socket = new WebSocket(
  'wss://api.traderepublic.com/',
);

function onLogoutClick () {
  const sessionToken = localStorage.getItem('sessionToken');

  if (sessionToken) {
    authStore.endSession(sessionToken);
  }
}

function onConnectWSClick () {
  socket.send('connect 26 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 119.0.0","clientId":"app.traderepublic.com","clientVersion":"1.27.5"}');
}

function onSearchChange (event: Event) {
  const target = event.target as HTMLInputElement;

  console.log(target.value);

  socket.send(`sub 1 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}`);
  socket.send(`sub 2 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}`);

  socket.onmessage = (event) => {
    const jsonString = event.data;
    console.log(jsonString);
    socket.send('unsub 1');
    socket.send('unsub 2');
  };
}
</script>

<template>
  <main class="dashboard-view view">
    <h1>Dashboard</h1>
    <button type="button" @click="onLogoutClick">Logout</button>
    <div class="tr-connection">
      <button @click="onConnectWSClick" type="button">
        <span>Connect to</span>
        <IconTR />
        <span>Websocket</span>
      </button>

      <input type="text" name="search" placeholder="Find stocks of ETFs" id="search" @change="onSearchChange">
    </div>
  </main>
</template>
