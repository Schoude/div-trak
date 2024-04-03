import { cheerio } from 'https://deno.land/x/cheerio@1.0.7/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let USD_EUR = 0;
  let EUR_USD = 0;

  const urlUSD_EUR =
    'https://www.xe.com/de/currencyconverter/convert/?Amount=1&From=USD&To=EUR';
  const urlEUR_USD =
    'https://www.xe.com/de/currencyconverter/convert/?Amount=1&From=EUR&To=USD';

  try {
    const [htmlUSD_EUR, htmlEUR_USD] = await Promise.all([
      (await fetch(urlUSD_EUR)).text(),
      (await fetch(urlEUR_USD)).text(),
    ]);

    {
      const $ = cheerio.load(htmlUSD_EUR);
      const rateText = $('.faded-digits')
        .parent()
        .first()
        .text();
      USD_EUR = +(+rateText.split(' ')[0].replace(',', '.')).toFixed(2);
    }

    {
      const $ = cheerio.load(htmlEUR_USD);
      const rateText = $('.faded-digits')
        .parent()
        .first()
        .text();
      EUR_USD = +(+rateText.split(' ')[0].replace(',', '.')).toFixed(2);
    }

    return new Response(
      JSON.stringify({
        USD_EUR,
        EUR_USD,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify(error),
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
