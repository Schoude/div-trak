import { defineStore } from 'pinia';

export const useTRStore = defineStore('tr', () => {
  const appVersion = '1.27.5';

  return {
    appVersion,
  };
});
