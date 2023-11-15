import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
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
      path: '',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        }
      ]
    },
    {
       path: '/:pathMatch(.*)*',
       name: 'NotFound',

       redirect: 'login'
    },
  ]
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Check if the user is not authenticated
  if (!authStore.isAuthenticated) {
    // Get the session token from local storage
    const sessionToken = localStorage.getItem('sessionToken');

    // If no session token is found
    if (!sessionToken) {
      // Redirect to the login page if the route is not already the login page
      to.name !== 'login' ? next({ name: 'login' }) : next();
    } else {
      // Check the session using the stored token
      await authStore.checkSession(sessionToken);
      next();
    }
  } else {
    // Allow authenticated users to proceed
    next();
  }
});


export default router;
