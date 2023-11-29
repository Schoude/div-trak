<script setup lang="ts">
import { ref } from 'vue';
import IconClose from '../icons/IconClose.vue';

const emit = defineEmits([
  'close',
]);

const modalBase = ref<HTMLDialogElement | null>(null);

function onClose () {
  emit('close');
  modalBase.value?.close();
}
</script>

<template>
  <dialog ref="modalBase">
    <header>
      <div class="title text-m">
        <slot name="title" />
      </div>
      <button class="btn-close" type="button" title="Close the modal" @click="onClose">
        <IconClose />
      </button>
    </header>

    <slot name="content" />

  </dialog>
</template>

<style scoped lang="scss">
$duration: .35s;
$movementY: 8px;

dialog[open] {
  opacity: 1;
  translate: 0 0;
}

dialog {
  opacity: 0;
  translate: 0 -#{$movementY};
  max-block-size: 90dvh;
  max-inline-size: 100%;
  inline-size: 95%;
  margin: auto;
  padding: 0;
  transition: all $duration ease-out allow-discrete;

  // Bug fix?!
  overflow-x: hidden;

  // Appearence
  border: 1px solid rgb(48, 48, 48);
  border-radius: 8px;
  box-shadow: var(--shadow);
  background-color: rgb(20, 20, 20);
  background-image: var(--gradient-page);
  background-repeat: no-repeat;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    translate: 0 $movementY;
  }
}

dialog::backdrop {
  margin-inline: 0;
  background-color: rgb(0 0 0 / 0);
  transition: all $duration ease-out allow-discrete;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(2px);
}

@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0);
    backdrop-filter: blur(0);
  }
}

header {
  display: flex;
  justify-content: space-between;
}

.title {
  padding: .5rem;
}

.btn-close {
  display: block;
  padding: .5rem;
  transition: scale 150ms ease-out;

  &:hover,
  &:focus-visible {
    scale: 1.08;

    .icon-close {
      fill: white;
    }
  }

  .icon-close {
    transition: fill 250ms ease-out;
    fill: rgba(255, 255, 255, 0.3);
  }
}
</style>