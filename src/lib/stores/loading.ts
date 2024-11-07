import { writable } from 'svelte/store';

export const isLoading = writable(true); // Initialize as true to show the loading screen initially