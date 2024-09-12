import { useAuthStore } from '@/stores/auth';
import { useInstrumentsStore } from '@/stores/instruments';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (_to, _from, next) => {
        const authStore = useAuthStore();

        if (authStore.isAuthenticated) {
          next({ name: 'dashboard' });
        } else {
          next();
        }
      },
    },
    {
      path: '/dashboard',
      component: () => import('../views/ContentView.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/content/DashboardView.vue'),
        },
      ],
    },
    {
      path: '/portfolio/:id',
      component: () => import('../views/ContentView.vue'),
      beforeEnter: (to, from, next) => {
        const instrumentsStore = useInstrumentsStore();

        if (instrumentsStore.getInstruments.length > 0) {
          next();
        } else if (from.name === 'dashboard') {
          next();
        } else {
          next({ name: 'dashboard' });
        }
      },
      children: [
        {
          path: '',
          name: 'portfolio',
          component: () => import('../views/content/PortfolioView.vue'),
        },
      ],
    },
    {
      path: '/instrument/:isin',
      component: () => import('../views/ContentView.vue'),
      children: [
        {
          path: '',
          name: 'instrument',
          component: () => import('../views/content/InstrumentView.vue'),
        },
      ],
    },
    {
      path: '/tr-auth',
      component: () => import('../views/ContentView.vue'),
      children: [
        {
          path: '',
          name: 'tr-auth',
          component: () => import('../views/content/TRAuthView.vue'),
        },
      ],
    },
    {
      path: '/market-insights',
      component: () => import('../views/ContentView.vue'),
      children: [
        {
          path: '',
          name: 'market-insights',
          component: () => import('../views/content/MarketInsightsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: 'login',
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Check if the user is not authenticated
  if (!authStore.isAuthenticated) {
    // Check the session using the stored token
    try {
      await authStore.checkSession();
      next();
    } catch (error) {

      // Prevents infinite redirect loop
      if (to.name !== 'login') {
        next({ name: 'login' });
      } else {
        next();
      }
    }
  } else {
    // Allow authenticated users to proceed
    next();
  }
});

// Page View Transitions
let resolveViewChange: ((value?: unknown) => void) | null = null;

router.beforeEach((_to, _from, next) => {
  document.startViewTransition(async () => {
    next();
    await new Promise((resolve) => resolveViewChange = resolve);
  });
});

router.afterEach(() => {
  resolveViewChange?.();
});

export default router;
