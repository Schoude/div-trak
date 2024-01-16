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

import { ref } from 'vue';

interface TRCredentials {
  phoneNumber: string;
  pin: string;
}

export function useTRAuth () {
  const processId = ref();

  async function login (credentials: TRCredentials) {
    const res = await fetch('https://tr-auth.deno.dev/api/v1/auth/web/login',
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

  return {
    login,
  };
}
