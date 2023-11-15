import type { Portfolio, Tables } from '@/supabase/types/helpers';

export type User = Pick<Tables<'users'>, 'id' | 'phone' | 'pin'> & {
  portfolios: Portfolio[];
};
