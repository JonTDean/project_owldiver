import { browser } from '$app/environment';
import { setupAutoRefresh } from '$lib/auth/refresh';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const cleanup = setupAutoRefresh();
    return {
      ...data,
      cleanup: () => cleanup()
    };
  }
  
  return {
    ...data,
    cleanup: () => {}
  };
}; 