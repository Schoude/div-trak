import type { Portfolio } from '@/supabase/types/helpers';


export type User = {
  id: string | null;
  email: string | null;
  access_token: string | null;
  portfolios: Portfolio[];
};
