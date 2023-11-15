<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';

const authStore = useAuthStore();

const loginData = reactive({ phone: '', pin: '' });

async function onSubmit () {
  console.log('submit');

  await authStore.login(loginData);
}
</script>

<template>
  <main class="login">
    <h1>Div-Trak | Login</h1>
    <form @submit.prevent="onSubmit">
      <label for="phone">
        <div class="label">Telefonnummer</div>
        <input v-model="loginData.phone" id="phone" type="text" placeholder="+49123456789">
      </label>
      <label for="pin">
        <div class="label">PIN</div>
        <input v-model="loginData.pin" id="pin" type="text" placeholder="8888">
      </label>
      <button>Einloggen</button>
    </form>
  </main>
</template>
