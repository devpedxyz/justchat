import type { GetUserResponseBody } from '$lib/user/types';

export async function getCurrentUser(): Promise<GetUserResponseBody> {
	return fetch('/api/me').then((res) => res.json());
}
