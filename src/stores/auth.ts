import { supabase } from '@/supabase/client';
import type { UserDataReturnType } from '@/supabase/types/functions';
import type { User } from '@/types/auth';
import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const sessionToken = ref(localStorage.getItem('sessionToken'));
  const user = ref<null | User>(null);

  const isAuthenticated = computed(() => sessionToken.value != null && user.value != null);

  async function login (loginData: {phone: string; pin: string}) {
    const loginRes = await supabase.functions.invoke<UserDataReturnType>('user-data', { body: loginData });
    if (loginRes.error) throw loginRes.error;

    if (loginRes.data) {
      user.value = loginRes.data.user;
      sessionToken.value = loginRes.data.token;

      router.push({ name: 'dashboard' });
    } else throw new Error('Response has no data: Function: user-data');
  }

  async function checkSession (token: string) {
    const checkSessionRes = await supabase.functions.invoke('user-auth', { body: { token: token } });
    if (checkSessionRes.error) throw checkSessionRes.error;

    if (checkSessionRes.data) {
      user.value = checkSessionRes.data.user;
      sessionToken.value = checkSessionRes.data.token;
    }
  }

  async function endSession (token: string) {
    const checkSessionRes = await supabase.functions.invoke('user-logout', { body: { token: token } });
    if (checkSessionRes.error) throw checkSessionRes.error;

    user.value = null;
    sessionToken.value = null;

    router.push({ name: 'login' });
  }

  watchEffect(async () => {
    if (typeof sessionToken.value === 'string') {
      localStorage.setItem('sessionToken', sessionToken.value);
    } else {
      localStorage.removeItem('sessionToken');
    }
  });

  return {
    user,
    isAuthenticated,
    login,
    checkSession,
    endSession,
    sessionToken,
   };
});
