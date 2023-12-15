import type { Tables } from '@/supabase/types/database';
import type { Portfolio } from '@/supabase/types/helpers';

export type User = Pick<Tables<'users'>, 'id' | 'phone' | 'pin'> & {
  portfolios: Portfolio[];
};
