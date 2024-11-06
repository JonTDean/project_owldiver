import { writable } from 'svelte/store';

function createFormAnimationStore() {
  const { subscribe, set } = writable({
    shouldAnimate: true,
    timestamp: Date.now()
  });

  return {
    subscribe,
    reset: () => {
      set({
        shouldAnimate: true,
        timestamp: Date.now()
      });
    }
  };
}

export const formAnimation = createFormAnimationStore();