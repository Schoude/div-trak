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
      beforeEnter: (to, _from, next) => {
        const authStore = useAuthStore();
        if (to.name !== 'login' && !authStore.isAuthenticated) {
          next({ name: 'login' });
        } else {
          next();
        }
      },
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

export default router;
