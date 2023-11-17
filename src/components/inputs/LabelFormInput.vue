<script setup lang='ts'>
defineProps<{
  forInput: string;
  text: string;
}>();
</script>

<template>
<label class="label-form-input" :for="forInput">
  <div class="label">{{ text }}</div>
  <slot />
</label>
</template>

<style lang='scss' scoped>
.label-form-input {
  display: block;
  margin-bottom: 1.125rem;

  .label {
    margin-bottom: .5rem;
  }
}
</style>
