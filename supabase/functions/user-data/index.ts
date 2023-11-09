import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import type { Database } from '../../../src/supabase/types/database.ts';
import type { DbResult } from '../../../src/supabase/types/helpers.ts';

Deno.serve(async (req) => {
  const { phone, pin } = await req.json();

  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  const q = supabaseClient
    .from('users')
    .select(`
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
    .eq('phone', phone)
    .eq('pin', pin)
    .single();

  const user: DbResult<typeof q> = await q;

  if (user.error) throw user.error;

  return new Response(JSON.stringify({ user: user.data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
