<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import { useTRAuth } from '@/composables/useTRAuth';
import { reactive } from 'vue';

const trAuth = useTRAuth();

const trCredentials = reactive({
  phoneNumber: '+49',
  pin: '',
});

async function onTRLoginClick () {
  await trAuth.login(trCredentials);
}
</script>

<template>
  <main class="tr-auth-view view">
    <form @submit.prevent="onTRLoginClick">
      <LabelFormInput text="Phone Number" for-input="tr-phone-number">
        <InputText id="tr-phone-number" v-model="trCredentials.phoneNumber" />
      </LabelFormInput>
      <LabelFormInput text="PIN" for-input="tr-pin">
        <InputText id="tr-pin" v-model="trCredentials.pin" />
      </LabelFormInput>
      <ButtonAction variant="dawn" class="button-tr-login">Login to TR</ButtonAction>
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
