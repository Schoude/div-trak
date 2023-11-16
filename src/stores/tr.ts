import { supabase } from '@/supabase/client';
import type { TRLoginReturnValue } from '@/types/tr';
import { defineStore } from 'pinia';


export const useTRStore = defineStore('tr', () => {
  const appVersion = '1.27.5';

  return {
    appVersion,
    async login (credentials: {phoneNumber: string, pin: string}): Promise<TRLoginReturnValue | null> {
      const res = await supabase.functions.invoke<TRLoginReturnValue>('tr-login',{ body: credentials });
      if (res.error) throw res.error;

      return res.data;
    },
  };
});
