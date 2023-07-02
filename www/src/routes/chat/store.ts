import { writable } from 'svelte/store';

export const isChatSidebarOpen = writable(true);
export const header = writable<{ heading?: string }>({ heading: 'JustChat' });
