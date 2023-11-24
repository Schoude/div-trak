import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import type { Database } from '../../../src/supabase/types/database.ts';
import type { DbResult } from '../../../src/supabase/types/helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { phone, pin } = await req.json();

  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  const q = supabaseClient
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
    .eq('phone', phone)
    .eq('pin', pin)
    .single();

  const user: DbResult<typeof q> = await q;

  if (user.error) throw user.error;

  const sessionQ = supabaseClient
    .from('sessions')
    .select('token')
    .eq('user_id', user.data.id)
    .single();

  const session: DbResult<typeof sessionQ> = await sessionQ;

  let token: string;
  if (session.error) {
    const newSessionQ = supabaseClient
      .from('sessions')
      .insert([{ user_id: user.data.id }])
      .select('token')
      .single();

    const newSession: DbResult<typeof newSessionQ> = await newSessionQ;

    if (newSession.data?.token == null) {
      throw new Error('Session token not generated.');
    }

    token = newSession.data.token;
  } else {
    token = session.data.token;
  }

  return new Response(JSON.stringify({
    user: user.data,
    token,
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    },
    status: 200,
  });
});
