import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database } from '../../../src/supabase/types/database.ts';
import type {
  DbResult,
  OrderNew,
} from '../../../src/supabase/types/helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { token, order, alreadyInPortfolio } = await req.json() as {
    token: string;
    alreadyInPortfolio: boolean;
    order: OrderNew;
  };

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

  if (alreadyInPortfolio === false) {
    const selectPortfolioQuery = supabaseClient
      .from('portfolios')
      .select('isins')
      .eq('id', order.portfolio_id)
      .single();

    const selectPortfolioResult: DbResult<typeof selectPortfolioQuery> =
      await selectPortfolioQuery;

    if (selectPortfolioResult.error) {
      return new Response(
        JSON.stringify({
          error: 'Server Error',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    const isins = selectPortfolioResult.data.isins;

    isins?.push(order.isin);

    const updatePortfolioQuery = supabaseClient
      .from('portfolios')
      .update({ isins })
      .eq('id', order.portfolio_id)
      .single();
    const uptedPortfolioResult: DbResult<typeof updatePortfolioQuery> =
      await updatePortfolioQuery;

    if (uptedPortfolioResult.error) {
      console.error(uptedPortfolioResult.error);

      return new Response(
        JSON.stringify({
          error: 'Server Error',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }
  }

  // Add new order
  const createOrderQuery = supabaseClient.from('orders').insert(order);
  const createOrderResult: DbResult<typeof createOrderQuery> =
    await createOrderQuery;

  if (createOrderResult.error) {
    console.error(createOrderResult.error);

    return new Response(
      JSON.stringify({
        error: 'Server Error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }

  const userQuery = supabaseClient
    .from('users')
    .select(`
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
    .eq('id', session.data.user_id)
    .single();

  const user: DbResult<typeof userQuery> = await userQuery;

  return new Response(
    JSON.stringify({
      user: user.data,
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
