import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/supabase/client';
import type { User } from '@/types/auth';
import type { UserDataReturnType } from '@/supabase/types/functions';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const sessionToken = ref(localStorage.getItem('sessionToken'));
  const user = ref<null | User>(null);

  const isAuthenticated = computed(() => sessionToken.value != null);

  async function login (loginData: {phone: string; pin: string}) {
    const loginRes = await supabase.functions.invoke<UserDataReturnType>('user-data', { body: loginData });
    if (loginRes.error) throw loginRes.error;

    if (loginRes.data) {
      user.value = loginRes.data.user;
      sessionToken.value = loginRes.data.token;

      await router.push({ name: 'dashboard' });
    } else throw new Error('Response has no data: Function: user-data');
  }

  watchEffect(() => {
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
   };
});
