import { writable, type Writable } from 'svelte/store';

interface BootState {
  terminalComplete: boolean;
  formVisible: boolean;
}

export const bootState: Writable<BootState> = writable({
  terminalComplete: false,
  formVisible: false
});
export const bootComplete = writable(false);
export const formVisible = writable(false); 