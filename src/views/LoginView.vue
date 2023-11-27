<script setup lang='ts'>
import FormLogin from '@/components/forms/FormLogin.vue';
</script>

<template>
  <main class="login-view">
    <FormLogin />
  </main>
</template>

<style scoped>
.login-view {
  display: grid;
  place-items: center;
  block-size: inherit;
}
</style>
