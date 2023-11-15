import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTRStore = defineStore('tr', () => {
  const appVersion = ref<null | string>(null);

  return {
    appVersion,
  };
});
