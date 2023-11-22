<script setup lang='ts'>
import { useTRSocket } from '@/composables/useTRSocket';

const socket = useTRSocket();

function onSearchChange (event: Event) {
  const target = event.target as HTMLInputElement;

  socket.sendMessage(`sub 1 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}`);
  socket.sendMessage(`sub 2 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}`);
}
</script>

<template>
  <footer class="bottom-bar">
    <input type="text" name="search" placeholder="Find stocks of ETFs" id="search" @change="onSearchChange">
  </footer>
</template>

<style lang='scss' scoped>
</style>
