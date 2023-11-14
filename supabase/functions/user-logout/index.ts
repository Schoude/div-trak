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

  const sessionDeleteQuery = supabaseClient
    .from('sessions')
    .delete()
    .eq('token', token);

  const sessionDeleted: DbResult<typeof sessionDeleteQuery> = await sessionDeleteQuery;

  if (sessionDeleted.error) {
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
      message: 'Logout successful'
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    },
  );
});
