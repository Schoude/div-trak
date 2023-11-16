import { corsHeaders } from '../_shared/cors.ts';
import { TR_API_URL } from '../_shared/tr/contants.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { processId, pin, loginCookies } = await req.json();

  try {
    const response2FA = await fetch(
      `${TR_API_URL}/v1/auth/web/login/${processId}/${pin}`,
      {
        method: 'POST',
        headers: {
          'cookie': loginCookies,
        },
      },
    );

    console.log(await response2FA.json());

    const trSessionString = response2FA.headers.getSetCookie()
      .find((cookieString) => cookieString.includes('tr_session'));

    if (trSessionString) {
      const trSession = trSessionString.split('=')[1].replace('; Path', '');

      return new Response(
        JSON.stringify({ trSession }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200,
        },
      );
    }

    // if ('errors' in data) {
    //   return new Response(
    //     JSON.stringify(data),
    //     {
    //       headers: {
    //         ...corsHeaders,
    //         'Content-Type': 'application/json'
    //       },
    //       status: 200,
    //     },
    //   );
    // } else {
    //   return new Response(
    //     JSON.stringify({ ...data, loginCookies }),
    //     {
    //       headers: {
    //         ...corsHeaders,
    //         'Content-Type': 'application/json'
    //       },
    //       status: 200,
    //     },
    //   );
    // }

  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      },
    );
  }
});
