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
    <label class="input-text" for="phone">
      <div class="label">Phone</div>
      <input v-model="loginData.phone" id="phone" type="text" placeholder="+49123456789">
    </label>
    <label class="input-text" for="pin">
      <div class="label">PIN</div>
      <input v-model="loginData.pin" id="pin" type="text" placeholder="8888">
    </label>
    <button>Einloggen</button>
  </form>
</div>
</template>

<style lang='scss' scoped>
.form-login {
  max-inline-size: 300px;
  margin-inline: auto;
}

.cta {
  margin-block-end: .5rem;
}

.input-text {
  display: block;
  margin-bottom: .45rem;

  .label {
    margin-bottom: .45rem;
  }

  input {
    padding: .5rem .75rem;
    inline-size: 100%;
    font-size: 1.2rem;
    border: none;
    background-color: rgba(255, 255, 255, 0.075);
    border-radius: 4px;
    box-shadow: 0px 5px 6px -4px rgba(0, 0, 0);
    transition: background-color 150ms ease-out;

    &:focus-visible {
        background-color: rgba(255, 255, 255, 0.105);
    }
  }
}



</style>
