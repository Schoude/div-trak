import { supabase } from '@/supabase/client';
import type { TRLoginReturnValue } from '@/types/tr';
import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useTRStore = defineStore('tr', () => {
  const appVersion = '1.27.5';
  const trSession = ref<string | null>(null);

  return {
    appVersion,
    trSession,
    async login (credentials: {phoneNumber: string, pin: string}): Promise<TRLoginReturnValue | null> {
      const res = await supabase.functions.invoke<TRLoginReturnValue>('tr-login',{ body: credentials });
      if (res.error) throw res.error;

      return res.data;
    },
    async confirm2FA (credentials2FA: {pin: string; processId: string; loginCookies: string}) {
      const res = await supabase.functions.invoke<string>('tr-2fa',{ body: credentials2FA });
      if (res.error) throw res.error;

      return res.data;
    }
  };
});
