import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Store to track last visited path and auth navigation state
const lastPathStore = writable<string | null>(null);
const isAuthNavigationStore = writable(false);

function createBootState() {
  const { subscribe, set } = writable({
    terminalComplete: false,
    formVisible: false
  });

  return {
    subscribe,
    set,
    reset: () => set({ terminalComplete: false, formVisible: false })
  };
}

const bootComplete = writable(false);

// Helper function to check if a path is an auth path
const isAuthPath = (path: string | null): boolean => {
  if (!path) return false;
  return path.includes('/auth/login') || path.includes('/auth/register');
};

// Check if we should show the boot sequence
const shouldShowBoot = (currentPath: string): boolean => {
  if (!browser) return false;

  const lastPath = get(lastPathStore);
  const isAuthNav = get(isAuthNavigationStore);
  
  // Debug logging
  console.log('Navigation Check:', {
    lastPath,
    currentPath,
    isAuthNav,
    isLastPathAuth: isAuthPath(lastPath),
    isCurrentPathAuth: isAuthPath(currentPath)
  });

  // Skip terminal if we're in an auth-to-auth navigation
  if (isAuthNav) {
    console.log('Skipping terminal - auth navigation in progress');
    lastPathStore.set(currentPath);
    isAuthNavigationStore.set(false);
    return false;
  }

  // Update last path
  lastPathStore.set(currentPath);

  // Show terminal only when coming from non-auth to auth
  return Boolean(
    (!lastPath && isAuthPath(currentPath)) || // First visit
    (lastPath && !isAuthPath(lastPath) && isAuthPath(currentPath)) // Non-auth to auth
  );
};

const resetBoot = () => {
  if (browser) {
    bootComplete.set(false);
    bootState.reset();
  }
};

// Clear navigation history and set auth navigation state
const clearHistory = () => {
  console.log('Clearing last path and setting auth navigation');
  lastPathStore.set(null);
  isAuthNavigationStore.set(true);
};

export const bootState = createBootState();
export { bootComplete, resetBoot, shouldShowBoot, clearHistory };