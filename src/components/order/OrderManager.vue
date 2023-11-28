<script setup lang="ts">
import { ref } from 'vue';
import ButtonAction from '../buttons/ButtonAction.vue';

const props = defineProps<{
  amountOwned: number;
}>();

const dialog = ref<HTMLDialogElement | null>(null);

const amountOrder = ref(0);

function onDialogOpenClick () {
  dialog.value?.showModal();
}

function onDialogCloseClick () {
  dialog.value?.close();
}
</script>

<template>
  <ButtonAction variant="dawn" @click="onDialogOpenClick">Place Order</ButtonAction>

  <template>
    <div class="span">asdasd</div>
  </template>

  <dialog ref="dialog">
    Content here {{ amountOrder }}
    <ButtonAction variant="dusk" @click="onDialogCloseClick">Close</ButtonAction>
  </dialog>
</template>

<style scoped lang="scss">
$duration: .35s;
$movementY: 20px;

dialog[open] {
  opacity: 1;
  translate: 0 0;
}

dialog {
  opacity: 0;
  translate: 0 -#{$movementY};
  max-block-size: 90dvh;
  inline-size: 95%;
  margin: auto;
  transition: all $duration allow-discrete;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    translate: 0 $movementY;
  }
}

dialog::backdrop {
  background-color: rgb(0 0 0 / 0);
  transition: all $duration allow-discrete;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 0.35);
  backdrop-filter: blur(2px);
}

@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0);
    backdrop-filter: blur(0);
  }
}
</style>