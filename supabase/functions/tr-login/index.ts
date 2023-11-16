import { TRLoginError, TRLoginReturnValue } from '../../../src/types/tr.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { TR_API_URL } from '../_shared/tr/contants.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const credentials = await req.json();

  try {
    const loginResponse = await fetch(`${TR_API_URL}/v1/auth/web/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const loginCookies = loginResponse.headers.getSetCookie();

    const data = await loginResponse.json() as TRLoginReturnValue | TRLoginError;

    if ('errors' in data) {
      return new Response(
        JSON.stringify(data),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200,
        },
      );
    } else {
      return new Response(
        JSON.stringify({ ...data, loginCookies }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200,
        },
      );
    }

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
