import { cheerio } from 'https://deno.land/x/cheerio@1.0.7/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';
import type { Dividend } from '../../../src/types/tr/events/stock-details.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { url } = await req.json() as { url: string };

  const html = await (await fetch(url)).text();

  const $ = cheerio.load(html);

  const unconfirmedDividends = $('tr:contains(\'unconfirmed/estimated\')');

  const dividends = new Map();

  unconfirmedDividends.each((_i, rowEl) => {
    const dividend: Dividend = {
      id: crypto.randomUUID(),
      paymentDate: '',
      recordDate: null,
      exDate: '',
      amount: 0,
      information: 'estimation',
    };

    $(rowEl).find('td').each((i, tdEl) => {
      switch (i) {
        case 0: {
          const exDate = $(tdEl).text();
          dividend.exDate = exDate;
          break;
        }
        case 1: {
          const paymentDate = $(tdEl).text();
          dividend.paymentDate = paymentDate;
          break;
        }
        case 2: {
          dividend.amount = +$(tdEl).text().replace(/[$*]+/g, '');
          break;
        }
      }
    });

    dividends.set(dividend.id, dividend);
  });

  return new Response(
    JSON.stringify({
      estimatedDividends: [...dividends.values()],
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
