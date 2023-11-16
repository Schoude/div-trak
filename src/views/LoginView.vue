<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';

const authStore = useAuthStore();

const loginData = reactive({ phone: '', pin: '' });

function onSubmit () {
  authStore.login(loginData);
}
</script>

<template>
  <main class="login">
    <h1>Please log in</h1>

    <div class="grid">
      <LogoDivTrak :width="250" />

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
  </main>
</template>

<style scoped>
.login {
  max-inline-size: 50%;
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 1rem;
  place-items: center;
  place-content: center;
}
</style>
