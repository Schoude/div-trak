import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import type { Database } from '../../../src/supabase/types/database.ts';
import type { DbResult } from '../../../src/supabase/types/helpers.ts';

Deno.serve(async (req) => {
  const { token } = await req.json();

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

  if (session.error) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      },
    );
  }

  const userQuery = supabaseClient
    .from('users')
    .select(`
      id,
      phone,
      pin,
      portfolios (
        name,
        isins,
        orders (
          isin,
          amount,
          year,
          month,
          day,
          executed_at
        )
      )
    `)
    .eq('id', session.data.user_id)
    .single();

  const user: DbResult<typeof userQuery> = await userQuery;

  if (user.error) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      },
    );
  }

  return new Response(
    JSON.stringify({
      user: user.data,
      token,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    },
  );
});
