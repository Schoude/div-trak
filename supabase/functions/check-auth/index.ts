import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import type { Database } from '../../../src/supabase/types/database.ts';
import type { DbResult } from '../../../src/supabase/types/helpers.ts';

Deno.serve(async (req) => {
  const { phone } = await req.json();
  const data = {
    message: `Hello ${phone}!`,
  };

  const supabaseClient = createClient<Database>(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  const q = supabaseClient
    .from('users')
    .select('pin')
    .eq('phone', phone)
    .single();

  const user: DbResult<typeof q> = await q;

  if (user.error) throw user.error;

  return new Response(JSON.stringify({ pin: user.data.pin, data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
