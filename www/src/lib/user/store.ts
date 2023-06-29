import { writable } from 'svelte/store';
import type { User } from './types';
import { getCurrentUser } from './repository';

export const currentUser = writable<User>(getCurrentUser());
