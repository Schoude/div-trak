<script setup lang='ts'>
withDefaults(
  defineProps<{
    modelValue: string;
    id: string;
    type?: 'text' | 'email' | 'password',
  }>(),
  {
    type: 'text',
  },
);

const emit = defineEmits(['update:modelValue']);

function onInput ($event: Event) {
  if ($event.target) {
    emit('update:modelValue', ($event.target as HTMLInputElement).value);
  }
}
</script>

<template>
  <input class="input-text" :value="modelValue" :id="id" :type="type" @input="onInput">
</template>

<style lang='scss' scoped>
.input-text {
  block-size: 48px;
  padding-inline: .75rem;
  inline-size: 100%;
  font-size: 1.2rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.075);
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: background-color 150ms ease-out;

  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.105);
  }
}
</style>
