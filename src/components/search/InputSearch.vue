<script setup lang='ts'>
import IconSearch from '@/components/icons/IconSearch.vue';
import { useTRSocket } from '@/composables/useTRSocket';

const socket = useTRSocket();

const emits = defineEmits([
  'focus:input',
]);

function onFirstFocus (event: Event) {
  const target = event.target as HTMLInputElement;

  emits('focus:input');

  if (target.value !== '') {
    return;
  }

  socket.sendMessage('sub 1 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}');
  socket.sendMessage('sub 2 {"type":"neonSearch","data":{"q":"","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}');
}

function onSearchInput (event: Event) {
  const target = event.target as HTMLInputElement;

  socket.sendMessage(`sub 1 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"stock"},{"key":"jurisdiction","value":"DE"}]}}`);
  socket.sendMessage(`sub 2 {"type":"neonSearch","data":{"q":"${target.value}","page":1,"pageSize":3,"filter":[{"key":"type","value":"fund"},{"key":"jurisdiction","value":"DE"}]}}`);
}
</script>

<template>
  <div class="input-field">
    <label for="instrument-name">
      <IconSearch />
      <input type="text" name="instrument-name" id="instrument-name" placeholder="Find stocks or ETFs" autocomplete="off"
        @focus="onFirstFocus" @input="onSearchInput">
    </label>
  </div>
</template>

<style scoped lang="scss">
.input-field {
  max-inline-size: 420px;
  margin-inline: auto;
}

label {
  display: flex;
  padding: .5rem;
  font-size: .85rem;
  align-items: center;
  border: none;
  background-color: rgba(255, 255, 255, 0.075);
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: background-color 150ms ease-out;

  &:focus-within {
    background-color: rgba(255, 255, 255, 0.105);
  }
}

input {
  background: transparent;
  border: none;
  flex: 1;
  padding-inline-start: .5rem;
}

.icon-search {
  fill: rgb(143, 143, 143);
}
</style>
