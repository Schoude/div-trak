<script setup lang='ts'>
defineProps<{
  modelValue: string;
  id: string;
}>();

const emit = defineEmits(['update:modelValue']);

function onInput ($event: Event) {
  if ($event.target) {
    emit('update:modelValue', ($event.target as HTMLInputElement).value);
  }
}
</script>

<template>
<input
  class="input-text"
  :value="modelValue"
  :id="id"
  type="text"
  @input="onInput"
>
</template>

<style lang='scss' scoped>
.input-text {
  padding: .5rem .75rem;
  inline-size: 100%;
  font-size: 1.2rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.075);
  border-radius: 4px;
  box-shadow: 0px 5px 6px -4px rgba(0, 0, 0);
  transition: background-color 150ms ease-out;

  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.105);
  }
}
</style>
