import { writable } from 'svelte/store';

export const isSidebarOpen = writable(true);
export const header = writable<{ heading?: string }>({ heading: 'JustChat' });
