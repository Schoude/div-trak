<script setup lang='ts'>
import IconClose from '@/components/icons/IconClose.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits([
  'focus:input',
  'update:modelValue',
]);

const showClearButton = computed(() => props.modelValue !== '');

function onFirstFocus () {
  emit('focus:input');
}

function onSearchInput ($event: Event) {
  if ($event.target) {
    emit('update:modelValue', ($event.target as HTMLInputElement).value);
  }
}
</script>

<template>
  <div class="input-field">
    <label for="instrument-name">
      <IconSearch />
      <input :value="modelValue" type="text" name="instrument-name" id="instrument-name" placeholder="Find stocks or ETFs"
        autocomplete="off" @focus="onFirstFocus" @input="onSearchInput">
      <div class="action">
        <button v-if="showClearButton" class="btn-clear" type="button" title="Delete search query"
          @click="emit('update:modelValue', '')">
          <IconClose />
        </button>
      </div>
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
  padding-inline: .5rem;
}

.icon-search {
  fill: rgb(143, 143, 143);
}

.action {
  inline-size: 24px;
}

.btn-clear {
  .icon {
    fill: rgb(143, 143, 143);
  }
}
</style>
