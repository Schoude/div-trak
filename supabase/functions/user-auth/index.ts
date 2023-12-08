import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import type { Database } from '../../../src/supabase/types/database.ts';
import type { DbResult } from '../../../src/supabase/types/helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

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
        error: 'Unauthorized',
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
    .eq('id', session.data.user_id)
    .single();

  const user: DbResult<typeof userQuery> = await userQuery;

  if (user.error) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
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
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    },
  );
});
