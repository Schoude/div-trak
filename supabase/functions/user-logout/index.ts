import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
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
        error: 'Unauthorized'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 401,
      },
    );
  }

  return new Response(
    JSON.stringify({
      message: 'Logout successful'
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200,
    },
  );
});
