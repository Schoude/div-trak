<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import { useTRAuth } from '@/composables/useTRAuth';
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const trAuth = useTRAuth();
const authStore = useAuthStore();

const trCredentials = reactive({
  phoneNumber: '+49',
  pin: '',
});
const pin2fa = ref('');

const canSendCredentials = computed(() =>
  trCredentials.phoneNumber != '' &&
  trCredentials.phoneNumber != '+49' &&
  trCredentials.pin != '' &&
  trCredentials.pin.length === 4);

const canSend2FA = computed(() => pin2fa.value != '' && pin2fa.value.length === 4);

async function onTRLoginClick () {
  if (!canSendCredentials.value) {
    return;
  }

  await trAuth.login(trCredentials);
}

async function onConfirm2FAClick () {
  if (!canSend2FA.value) {
    return;
  }

  await router.push({ name: 'dashboard' });
  await trAuth.confirm2FA(pin2fa.value, authStore.user?.id!);
}
</script>

<template>
  <main class="tr-auth-view view">
    <form @submit.prevent="onTRLoginClick" v-if="!trAuth.show2FAForm.value">
      <h1>TR Credentials</h1>
      <LabelFormInput text="Phone Number" for-input="tr-phone-number">
        <InputText id="tr-phone-number" v-model="trCredentials.phoneNumber" />
      </LabelFormInput>
      <LabelFormInput text="PIN" for-input="tr-pin">
        <InputText id="tr-pin" v-model="trCredentials.pin" />
      </LabelFormInput>
      <ButtonAction variant="dawn" class="button-tr-login">Login to TR</ButtonAction>
    </form>

    <form @submit.prevent="onConfirm2FAClick" v-else>
      <h1>2FA PIN</h1>
      <LabelFormInput text="PIN" for-input="tr-pin-2fa">
        <InputText id="tr-pin-2fa" v-model="pin2fa" autocomlete="off" />
      </LabelFormInput>
      <ButtonAction variant="dawn" class="button-tr-login">Confirm 2FA</ButtonAction>
    </form>
  </main>
</template>

<style lang='scss' scoped>
.button-tr-login {
  margin-block-start: 2rem;
  inline-size: fit-content;
  padding-inline: 1rem 1rem;
  block-size: 2.25rem;
}
</style>
