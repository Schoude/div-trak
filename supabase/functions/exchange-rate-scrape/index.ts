import { cheerio } from 'https://deno.land/x/cheerio@1.0.7/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = 'https://www.xe.com/de/currencyconverter/convert/?Amount=1&From=USD&To=EUR';
  const html = await (await fetch(url)).text();

  const $ = cheerio.load(html);
  console.log($('[class*="BigRate"]').text());

  return new Response(
    JSON.stringify({
      test: 'test',
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    },
  );
});
