import { writable } from 'svelte/store';

type Theme = {
  colors: {
    primary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
  };
  fonts: {
    mono: string;
    sans: string;
  };
};

const militaryTheme: Theme = {
  colors: {
    primary: '#dc2626', // red-600
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent: '#991b1b', // red-800
    muted: '#6b7280', // gray-500
    border: 'rgba(220, 38, 38, 0.2)', // red-600 with opacity
  },
  fonts: {
    mono: '"JetBrains Mono", monospace',
    sans: 'system-ui, sans-serif',
  },
};

export const theme = writable<Theme>(militaryTheme); 