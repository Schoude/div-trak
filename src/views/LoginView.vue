<script setup lang='ts'>
import FormLogin from '@/components/forms/FormLogin.vue';
</script>

<template>
  <main class="login-view view">
    <FormLogin />
  </main>
</template>

<style scoped>
.login-view {
  display: grid;
  place-items: center;
  min-block-size: inherit;
}
</style>
