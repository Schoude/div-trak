import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.1';
import type { Database } from '../../../src/supabase/types/database.ts';
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

  const { order, alreadyInPortfolio } = await req.json() as {
    alreadyInPortfolio: boolean;
    order: OrderNew;
  };

  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  // Add instrument to portfolio
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
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
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
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 500,
        },
      );
    }
  }

  // Add new order for instrument
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }

  // Return the portfolios for the user
  try {
    // const user = await getUserPortfolios(userId);

    return new Response(
      JSON.stringify({
        message: 'Success',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: 'Server Error',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});
