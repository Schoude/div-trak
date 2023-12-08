import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import type { Database } from '../../../src/supabase/types/database.ts';
import type {
  DbResult,
} from '../../../src/supabase/types/helpers.ts';

export async function getUserPortfolios (id: number) {
  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  const userQuery = supabaseClient
    .from('users')
    .select(`
      portfolios (
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
      )
    `)
    .eq('id', id)
    .single();

  const result: DbResult<typeof userQuery> = await userQuery;

  if (result.error) throw result.error;

  return result.data;
}

export async function getUserSessionFromToken (token: string) {
  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  const sessionQuery = supabaseClient
    .from('sessions')
    .select('user_id')
    .eq('token', token)
    .single();

  const session: DbResult<typeof sessionQuery> = await sessionQuery;

  if (session.error) throw session.error;

  return session.data;
}
