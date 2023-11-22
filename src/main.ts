import '@/styles/main.scss';

import { createPinia } from 'pinia';
import { createApp, h } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp({
  name: 'Div-Trak',
  setup () {
    return () => h(App);
  },
});

app.use(createPinia())
  .use(router)
  .mount('#app');
