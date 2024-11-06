import toast, { type ToastOptions } from 'svelte-french-toast';
import { cn } from '$lib/utils';

type MilitaryToastType = 'success' | 'error' | 'warning' | 'info';

interface MilitaryToastOptions extends Partial<ToastOptions> {
  message: string;
  type?: MilitaryToastType;
  icon?: string;
}

const defaultIcons: Record<MilitaryToastType, string> = {
  success: '⭐',
  error: '⚠️',
  warning: '🚫',
  info: 'ℹ️'
};

const militaryToast = {
  show: ({ message, type = 'info', icon, ...options }: MilitaryToastOptions) => {
    return toast(message, {
      className: cn('military-toast'),
      icon: icon || defaultIcons[type],
      duration: 4000,
      position: 'top-center',
      style: `
        margin-top: 6rem;
        transform: translateX(-50%);
        max-width: 500px;
        width: 90%;
      `,
      data: { type },
      ...options
    });
  },

  success: (message: string, options?: Partial<MilitaryToastOptions>) => {
    return militaryToast.show({ message, type: 'success', ...options });
  },

  error: (message: string, options?: Partial<MilitaryToastOptions>) => {
    return militaryToast.show({ message, type: 'error', ...options });
  },

  warning: (message: string, options?: Partial<MilitaryToastOptions>) => {
    return militaryToast.show({ message, type: 'warning', ...options });
  },

  info: (message: string, options?: Partial<MilitaryToastOptions>) => {
    return militaryToast.show({ message, type: 'info', ...options });
  }
};

export default militaryToast; 