/**
 * Steps to login into TR
 *
 * Login Request
 * 1. First login request with Phone Number and PIN
 * 1.1 Save the `processId` from the response
 * 1.2 Triggers the 2FA from the app
 *
 * 2FA confirmation
 * -> Sets the headers from TR (hopefully) -> remove domain field on cookies
 */

import { computed, ref } from 'vue';

const rootURL = 'https://tr-auth.deno.dev';

interface TRCredentials {
  phoneNumber: string;
  pin: string;
}

export function useTRAuth () {
  const processId = ref<string | null>(null);

  async function login (credentials: TRCredentials) {
    const res = await fetch(`${rootURL}/api/v1/auth/web/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(credentials),
      },
    );

    if (!res.ok) {
      throw new Error('Error login in with credentials');
    }

    const data: { processId: string } = await res.json();

    processId.value = data.processId;
  }

  async function confirm2FA (pin: string, userId: string) {
    if (!processId.value) {
      throw new Error('No process id present. Call `login` first.');
    }

    const res = await fetch(`${rootURL}/api/v1/auth/web/login/${processId.value}/${pin}/${userId}`,
      {
        method: 'POST',
      },
    );

    if (!res.ok) {
      throw new Error('Error 2FA confirmation');
    }

    processId.value = null;
  }

  // ### Renew session
  // GET {{baseUrl}}/v1/auth/web/session

  // ### Account
  // GET {{baseUrl}}/v2/data/account

  // ### Trending Stocks
  // GET {{baseUrl}}/v1/ranking/trendingStocks


  return {
    login,
    confirm2FA,
    show2FAForm: computed(() => processId.value != null),
  };
}
