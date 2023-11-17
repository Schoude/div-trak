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
  margin-bottom: .45rem;

  .label {
    margin-bottom: .45rem;
  }
}
</style>
