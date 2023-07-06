import type { GetUserResponseBody } from './types';
import { getCurrentUser as repoGetCurrentUser } from './repository';

export async function getCurrentUser(): Promise<GetUserResponseBody> {
	const user = repoGetCurrentUser();

	if (!user) {
		return { data: null, error: { message: 'User not found' } };
	}

	return { data: { user } };
}
