<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import LogoDivTrak from '@/components/logos/LogoDivTrak.vue';
import { useAuthStore } from '@/stores/auth';
import { reactive } from 'vue';

const authStore = useAuthStore();

const loginData = reactive({ email: '', password: '' });

function onSubmit () {
  authStore.login(loginData);
}
</script>

<template>
  <div class="form-login">
    <LogoDivTrak :width="250" />
    <p class="cta text-l">Enter your credentials</p>
    <form @submit.prevent="onSubmit">
      <LabelFormInput for-input="email" text="Email">
        <InputText type="email" v-model="loginData.email" id="email" placeholder="john@doe.com" autocomplete="email" />
      </LabelFormInput>

      <LabelFormInput for-input="password" text="PIN">
        <InputText type="password" v-model="loginData.password" id="password" placeholder="8888"
          autocomplete="password" />
      </LabelFormInput>

      <ButtonAction variant="dawn">Login</ButtonAction>
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
</style>
