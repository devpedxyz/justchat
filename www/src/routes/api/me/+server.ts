import { getCurrentUser } from '$lib/user/api';
import { json } from '@sveltejs/kit';

export async function GET(): Promise<Response> {
	const payload = await getCurrentUser();

	return json(payload);
}
