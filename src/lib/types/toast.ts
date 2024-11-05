import type { ToastOptions, ValueOrFunction } from 'svelte-french-toast';

export interface CustomToastOptions extends Omit<ToastOptions, 'message'> {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  message?: ValueOrFunction<string>;
} 