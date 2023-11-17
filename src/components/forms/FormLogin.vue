<script setup lang='ts'>
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';

const authStore = useAuthStore();

const loginData = reactive({ phone: '', pin: '' });

function onSubmit () {
  authStore.login(loginData);
}
</script>

<template>
<div class="form-login">
  <LogoDivTrak :width="250" />
  <p class="cta text-l">Enter your credentials</p>
  <form @submit.prevent="onSubmit">
    <label for="phone">
      <div class="label">Phone</div>
      <input v-model="loginData.phone" id="phone" type="text" placeholder="+49123456789">
    </label>
    <label for="pin">
      <div class="label">PIN</div>
      <input v-model="loginData.pin" id="pin" type="text" placeholder="8888">
    </label>
    <button>Einloggen</button>
  </form>
</div>
</template>

<style lang='scss' scoped>
.cta {
  margin-block-end: .5rem;
}
</style>
