import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.1';
import type { Database } from '../../../src/supabase/types/database.ts';
import type {
  DbResult,
} from '../../../src/supabase/types/helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getUserPortfolios, getUserSessionFromToken } from '../_shared/user-data-helper.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { token, isLastOrderInPortfolio, orderToDelete } = await req.json() as {
    token: string;
    isLastOrderInPortfolio: boolean;
    orderToDelete: {
      id: number;
      portfolioId: number;
      isin: string;
    };
  };

  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  let session: Session;

  try {
    session = await getUserSessionFromToken(token);
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 401,
      },
    );
  }

  // Delete order for instrument
  const createOrderQuery = supabaseClient
    .from('orders')
    .delete()
    .eq('id', orderToDelete.id);
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

  // Remove instrument to portfolio
  if (isLastOrderInPortfolio) {
    const selectPortfolioQuery = supabaseClient
      .from('portfolios')
      .select('isins')
      .eq('id', orderToDelete.portfolioId)
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

    const isins = selectPortfolioResult.data.isins.filter(isin => isin !== orderToDelete.isin);

    const updatePortfolioQuery = supabaseClient
      .from('portfolios')
      .update({ isins })
      .eq('id', orderToDelete.portfolioId)
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

  // Return the portfolios for the user
  try {
    const user = await getUserPortfolios(session.user_id);

    return new Response(
      JSON.stringify({
        user,
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
