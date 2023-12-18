import { supabase } from '@/supabase/client';
import type { DbResult, Portfolio } from '@/supabase/types/helpers';
import type { User } from '@/types/auth';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<null | User>(null);

  const isAuthenticated = computed(() => user.value?.id != null && user.value?.access_token != null);

  async function login (loginData: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      throw error;
    }

    const q = supabase
      .from('portfolios')
      .select(`
        id,
        name,
        isins,
        orders (
          id,
          isin,
          amount,
          year,
          month,
          day,
          executed_at,
          execution_type
        )
      `)
      .eq('user_id', data.user.id);

    const userPortfolios: DbResult<typeof q> = await q;

    if (userPortfolios.error) throw userPortfolios.error;

    if (userPortfolios.data) {
      user.value = {
        id: data.user.id,
        email: data.user.email!,
        access_token: data.session.access_token,
        portfolios: userPortfolios.data!.map((portfolio) => {
          return {
            id: portfolio.id,
            name: portfolio.name,
            isins: portfolio.isins,
            orders: portfolio.orders,
          } as Portfolio;
        }),
      };

      router.push({ name: 'dashboard' });
    } else throw new Error('Response has no data: Function: user-data');
  }

  async function checkSession () {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (data.session) {
      const q = supabase
        .from('portfolios')
        .select(`
        id,
        name,
        isins,
        orders (
          id,
          isin,
          amount,
          year,
          month,
          day,
          executed_at,
          execution_type
        )
      `)
        .eq('user_id', data.session.user.id);

      const userPortfolios: DbResult<typeof q> = await q;

      if (userPortfolios.error) throw userPortfolios.error;

      if (userPortfolios.data) {
        user.value = {
          id: data.session.user.id,
          email: data.session.user.email!,
          access_token: data.session.access_token,
          portfolios: userPortfolios.data!.map((portfolio) => {
            return {
              id: portfolio.id,
              name: portfolio.name,
              isins: portfolio.isins,
              orders: portfolio.orders,
            } as Portfolio;
          }),
        };
      }
    } else {
      throw new Error('Session not found.');
    }
  }

  async function endSession () {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    user.value!.access_token = null;
    await router.push({ name: 'login' });
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    login,
    checkSession,
    endSession,
  };
});
