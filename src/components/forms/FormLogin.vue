<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
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
    <LabelFormInput for-input="phone" text="Phone">
      <InputText v-model="loginData.phone" id="phone" placeholder="+49123456789" />
    </LabelFormInput>

    <LabelFormInput for-input="pin" text="PIN">
      <InputText v-model="loginData.pin" id="pin" placeholder="8888" />
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
