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

  async function trendingStocks (userId: string) {
    const res = await fetch(`${rootURL}/api/v1/data/ranking/trendingStocks/${userId}`);

    console.log(res.status);

    if (!res.ok) {
      throw new Error('Error 2FA confirmation');
    }

    console.log(await res.json());
  }

  return {
    login,
    confirm2FA,
    trendingStocks,
    show2FAForm: computed(() => processId.value != null),
  };
}
